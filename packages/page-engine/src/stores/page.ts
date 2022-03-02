import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import { cloneDeep, defaults, set } from 'lodash';

import { LoopNode, LoopNodeConf, ComposedNodeConf } from '../index';
import { elemId } from '../utils';
import { findNode, findParentId,
  removeNode as removeTreeNode, copyNode as copyTreeNode,
  replaceNode as replaceTreeNode } from '../utils/tree-utils';
import registry from './registry';
import dataSource from './data-source';
import type { DragPos, PageNode, PageSchema, SchemaElements, SourceElement } from '../types';
import { mapRawProps, mergeAsRenderEngineProps, transformLifecycleHooks } from '../utils/schema-adapter';
import { initPageSchema, deepMergeNode, generateGridChildren } from './page-helpers';

type Mode = 'design' | 'preview'

interface AppendNodeOptions {
  from?: 'source' | 'canvas';
  [key: string]: any;
}

class PageStore {
  @observable schema: PageSchema = initPageSchema();
  @observable mode: Mode = 'design';
  @observable activeElemId = '';
  @observable hoverElemId='';
  @observable dragPos: DragPos = 'down';
  @observable schemaElements: Record<string, SchemaElements> = {};
  @observable parentNodes: string[] = []; // canvas cur node's parents
  loopType='';

  constructor() {
    makeObservable(this);
  }

  @computed
  get rawActiveElem(): any {
    if (!this.activeElemId) {
      return null;
    }

    return findNode(this.schema.node, this.activeElemId, true);
  }

  @computed
  get activeElem(): any {
    return findNode(this.schema.node, this.activeElemId);
  }

  @computed
  get activeElemProps(): any {
    return mapRawProps(this.activeElem?.props || {});
  }

  @computed
  get activeElemParents(): string[] {
    const parentIds: string[] = [];
    findParentId(toJS(this.schema.node), this.activeElemId, parentIds, toJS(this.schema.node));
    return parentIds;
  }

  findElement(id: string): any {
    if (!id) {
      return null;
    }
    return findNode(this.schema.node, id);
  }

  @action
  setSchema = (schema: PageSchema): void => {
    // ignore html node
    if (schema.node.type === 'html-element') {
      return;
    }

    this.schema = schema || initPageSchema();

    // init data source when set page schema
    runInAction(() => {
      dataSource.sharedState = dataSource.mapSharedStateSpec();
      dataSource.apiState = dataSource.mapApiStateSpec();
    });
  }

  @action
  setMode = (mode: Mode): void => {
    this.mode = mode;
  }

  @action
  setActiveElemId = (id: string): void => {
    this.activeElemId = id;
  }

  @action
  setDragPos = (pos: DragPos): void => {
    this.dragPos = pos;
  }

  getRealNode = (rawNode: PageNode): PageNode => {
    // return rawNode.type === 'loop-container' ? (rawNode as any).node : rawNode;
    if (rawNode.type === 'loop-container') {
      const { node } = rawNode;
      if (node && node.type === 'composed-node') {
        return node?.outLayer || ({} as PageNode);
      }

      return node as PageNode;
    }
    return rawNode;
  }

  @action
  appendNode = (node: Omit<PageNode, 'type' | 'id'>, target?: Omit<PageNode, 'type' | 'id'> | null, options?: AppendNodeOptions): void => {
    const pageId=this.schema.node.id;
    const origSrcId=(node as PageNode)?.id;
    const targetId = (target as PageNode)?.id || this.activeElemId || pageId;
    if(targetId === origSrcId){
      return;
    }
    const targetNode = findNode(this.schema.node, targetId, true);
    let targetRealNode = targetNode;

    if (targetNode.type === 'loop-container') {
      if (targetNode.node && targetNode.node.type === 'composed-node') {
        const { children, outLayer } = targetNode.node;
        if (outLayer.id !== targetId) {
          (children || []).forEach((child: PageNode) => {
            if (child.id === targetId) {
              this.loopType = 'composed-node';
              targetRealNode = child;
            }
          });
        } else {
          this.loopType = 'composed-node';
          targetRealNode = outLayer;
        }
      } else {
        if (targetNode.node.id === targetId) {
          this.loopType = 'loop-container';
          targetRealNode = targetNode.node;
        }
      }
    }

    if(options?.from === 'source'){
      // when click source panel elem, if target can accept child, append src node
      if(registry.acceptChild(targetRealNode.exportName)){
        this.dragPos = 'inner';
      } else {
        this.dragPos = 'down';
      }
    } else {
      if(this.dragPos === 'inner' && !registry.acceptChild(targetRealNode.exportName)){
        return;
      }
    }

    const componentId = origSrcId || elemId(node.exportName);
    const params: Partial<PageNode> = {
      id: componentId,
      pid: this.dragPos === 'inner' ? targetRealNode.id : (targetRealNode.pid || pageId),
      supportStateExposure: true,
      type: 'react-component',
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      props: mergeAsRenderEngineProps({}, {
        id: componentId, // Default mount ID
        ...(node.defaultConfig || {}),
      }),
    };

    if (registry.acceptChild(node.exportName)) {
      Object.assign(params, { children: [] });
      // check layout comps
      if (node.exportName === 'grid') {
        params.children = generateGridChildren(node, params.id || '').children;
      }
      if (node.exportName === 'modal') {
        // fill modal body with container component, so it can accept other elements
        params.children = [{
          id: elemId('container'),
          pid: params.id,
          type: 'react-component',
          exportName: 'container',
          packageName: 'ofa-ui',
          packageVersion: 'latest',
          label: '容器',
          props: {},
          disableActions: true,
          children: [],
        }];
      }
    }

    let srcNode = defaults({}, node, params);

    // check if srcNode already in page
    const foundNode = findNode(this.schema.node, origSrcId || srcNode.id);
    if (foundNode) {
      srcNode = defaults(cloneDeep(foundNode), params);
    }

    if (this.loopType === 'composed-node') {
      const rawPropsKeys = Object.keys(mapRawProps(srcNode.props)).join(',');
      srcNode.toProps = {
        type: 'to_props_function_spec',
        args: 'state',
        body: `//${rawPropsKeys}\nreturn {}`,
      };
    }

    if(!targetRealNode) {
      window.__isDev__ && console.log('no target node');
      return;
    }

    window.__isDev__ && console.log('append node: ', toJS(srcNode), toJS(targetRealNode), this.dragPos);

    if (this.dragPos === 'up') {
      this.insertBefore(srcNode as PageNode, targetRealNode, options);
    } else if (this.dragPos === 'inner') {
      this.appendChild(srcNode as PageNode, targetNode, targetRealNode, options);
    } else if (this.dragPos === 'down') {
      this.insertAfter(srcNode as PageNode, targetRealNode, options);
    }
    this.loopType='';
  }

  @action
  appendChild=(src: PageNode, targetWrap: PageNode, target: PageNode, options?: AppendNodeOptions): void=> {
    const srcNode=this.getRealNode(src);
    if (srcNode.id && options?.from !== 'source') {
      const srcParent = findNode(this.schema.node, srcNode.pid);
      if(!srcParent?.children) return;

      const isLoopNode = srcNode.type === 'loop-container';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const srcNodeId = isLoopNode ? srcNode.node.id : srcNode.id;

      const idx = srcParent.children.findIndex((v: PageNode) => v.id === srcNodeId || v.id === srcNode.id);
      if (idx > -1) {
        // remove src node
        srcParent.children.splice(idx, 1);

        // append to target
        if (isLoopNode) {
          set(srcNode, 'node.pid', target.id);
        }
        target?.children?.push(Object.assign(srcNode, { pid: target.id }));
      }
    } else {
      // from source panel
      const newNode=Object.assign({}, srcNode, {pid: target.id});

      if (target?.children) {
        target?.children?.push(newNode);
      } else if (this.loopType === 'composed-node') {
        // fixme
        if(targetWrap.node?.outLayer?.id === target.id) {
          targetWrap?.node?.children?.push(newNode);
        }
      }
    }
  }

  @action
  insertBefore = (rawNode: PageNode, target: PageNode, options?: AppendNodeOptions): void => {
    const node = this.getRealNode(rawNode);
    const srcParent = findNode(this.schema.node, node.pid);
    const targetParent = findNode(this.schema.node, target.pid);
    let srcIdx = -1;
    let targetIdx = -1;

    if (srcParent && srcParent.children) {
      srcIdx = srcParent.children.findIndex((v: PageNode) => v.id === node.id || v.id === rawNode.id);
    }

    if (targetParent && targetParent.children) {
      targetIdx = targetParent.children.findIndex((v: PageNode) => v.id === target.id);
      if (srcIdx > -1 && targetIdx > -1) {
        // remove node from src parent
        srcParent.children.splice(srcIdx, 1);

        set(node, 'pid', targetParent.id);
        const newNode = Object.assign(rawNode, { pid: targetParent.id });
        if (targetIdx === 0) {
          targetParent.children.unshift(newNode);
        } else {
          if ((srcParent.id === targetParent.id) && (srcIdx < targetIdx)) { // src node removed, targetIdx should be subtract 1
            targetIdx -= 1;
          }
          targetParent.children.splice(targetIdx, 0, newNode);
        }
      }
    }
  }

  @action
  insertAfter = (rawNode: PageNode, target: PageNode, options?: AppendNodeOptions): void => {
    const node = this.getRealNode(rawNode);
    const srcParent = findNode(this.schema.node, node.pid);
    const targetParent = findNode(this.schema.node, target.pid);
    let srcIdx = -1; // node in src parent idx
    let targetIdx = -1; // node in target parent idx

    // 复制元素的拖动
    if (srcParent && srcParent.children) {
      srcIdx = srcParent.children.findIndex((v: PageNode) => v.id === node.id || v.id === rawNode.id);
    }

    if (targetParent && targetParent.children) {
      targetIdx = targetParent.children.findIndex((v: PageNode) => v.id === target.id);

      // remove node in src parent
      if(srcIdx > -1) {
        srcParent.children.splice(srcIdx, 1);
      }

      const targetNode=Object.assign({}, rawNode, {pid: targetParent.id});
      set(node, 'pid', targetParent.id);
      if(targetIdx > -1){
        targetParent.children.splice(targetIdx + 1, 0, targetNode);
      } else {
        targetParent.children.push(targetNode);
      }
    }
  }

  @action
  copyNode = (id: string): void => {
    const srcNode = findNode(this.schema.node, this.activeElemId, true);

    if (srcNode.type === 'loop-container') {
      if (srcNode.node && srcNode.node.type === 'composed-node') {
        const { children, outLayer } = srcNode.node;
        if (outLayer.id !== id) {
          let _oldNode = {} as PageNode;
          (children || []).map((child: PageNode) => {
            if (child.id === id) {
              _oldNode = child;
            }
            return child;
          });
          if (_oldNode.id) {
            copyTreeNode(this.schema.node, id, deepMergeNode(_oldNode));
            return;
          }
        }
      }
    }

    copyTreeNode(this.schema.node, id, deepMergeNode(srcNode));
  }

  @action
  removeNode = (id: string): void => {
    removeTreeNode(this.schema.node, id);
    this.activeElemId = '';
  }

  @action
  updateElemProperty = (elem_id: string, propKey: string, conf: any, options?: Record<string, any>): void => {
    const elem = findNode(this.schema.node, elem_id) || findNode(this.schema.node, elem_id, true);
    if(!elem) return;

    let actualNode = elem;
    // todo: remove
    if (!options?.useRawNode && elem.type === 'loop-container') {
      // support composed-node
      if (elem.node.type === 'composed-node') {
        const { outLayer, children } = elem.node;
        if (outLayer && outLayer.id === this.activeElemId) {
          actualNode = outLayer;
        }

        if (children && outLayer.id !== this.activeElemId) {
          actualNode = children.find((item: PageNode) => item.id === this.activeElemId);
        }
      } else {
        actualNode = elem.node;
      }
    }

    // console.log('update node props: ', elem_id, toJS(actualNode), propKey, conf);

    if (propKey === 'props') {
      set(actualNode, propKey, mergeAsRenderEngineProps(toJS(this.activeElem?.props), conf));
      if (actualNode.exportName && actualNode.exportName === 'grid') {
        set(actualNode, 'children', generateGridChildren(toJS(actualNode), actualNode.id, conf).children);
      }
    } else if (propKey === 'props.style') {
      // fixme: style bind variable
      set(actualNode, propKey, { type: 'constant_property', value: conf });
    } else if (propKey === 'lifecycleHooks') {
      set(actualNode, propKey, transformLifecycleHooks(conf));
    } else {
      set(actualNode, propKey, conf);
    }
  }

  getElemBoundActions = (): string[] => {
    const elemConf = registry.getElemByType(this.activeElem?.exportName) as SourceElement<any>;
    return ['didMount', 'willUnmount'].concat(elemConf?.exportActions || []);
  }

  @action
  replaceNode = (node_id: string, replaced: PageNode): void => {
    // const parent = findParent(this.schema.node, node_id);
    // if (parent) {
    //   const srcIdx = parent.children?.findIndex((v) => v.id === node_id || get(v, 'node.id') === node_id) ?? -1;
    //   console.log(srcIdx);
    //   if (srcIdx > -1) {
    //     parent.children?.splice(srcIdx, 1, replaced);
    //   }
    // }
    const srcNode = findNode(this.schema.node, this.activeElemId, true);

    if (srcNode.type === 'loop-container') {
      if (srcNode.node && srcNode.node.type === 'composed-node') {
        const { children, outLayer } = srcNode.node;
        if (outLayer.id !== node_id) {
          let _oldNode = {} as PageNode;
          (children || []).map((child: PageNode) => {
            if (child.id === node_id) {
              _oldNode = child;
            }
            return child;
          });
          if (_oldNode.id) {
            replaceTreeNode(this.schema.node, node_id, replaced);
            return;
          }
        }
      }
    }

    replaceTreeNode(this.schema.node, node_id, replaced);
  }

  @action
  setNodeAsLoopContainer = (node_id: string, loopConfig: Partial<LoopNodeConf>): void => {
    // wrap normal node as loop node
    const target = findNode(this.schema.node, node_id);
    if (!target) {
      return;
    }
    const nodeCopy = cloneDeep(target);
    const loopNodeConfig = {
      id: elemId('loop-node'),
      type: 'loop-container',
      node: nodeCopy,
      loopKey: loopConfig.loopKey || 'id',
      toProps: {
        args: 'state',
        body: loopConfig.toProps || 'return state',
        type: 'to_props_function_spec',
      },
      iterableState: loopConfig.iterableState || {},
    };

    // console.log('set loop node: ', loopNodeConfig);
    this.replaceNode(node_id, loopNodeConfig as any);
  }

  @action
  updateCurNodeAsLoopContainer = (propKey: string, confItem: any): void => {
    if (!this.rawActiveElem?.iterableState) {
      // replace current normal node to loop node
      this.setNodeAsLoopContainer(this.activeElemId, { [propKey]: confItem });
    } else {
      // update loop node iterable state config
      this.updateElemProperty(this.activeElemId, propKey, propKey === 'toProps' ? {
        args: 'state',
        body: confItem || 'return state',
        type: 'to_props_function_spec',
      } : confItem, { useRawNode: true });
    }
  }

  @action
  unsetLoopNode = (loop_node_id: string): void => {
    // reset loop container, lift up inner node
    const loopNode = findNode(this.schema.node, loop_node_id, true);
    if (!loopNode) {
      return;
    }
    if (loopNode.type === 'loop-container') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const innerNode = (loopNode as LoopNode).node;
      this.replaceNode(loop_node_id, innerNode as PageNode);
    }
  }

  @action
  reset = (): void => {
    this.schema = initPageSchema();
    this.mode = 'design';
    this.activeElemId = '';
    this.dragPos = 'down';
  }

  @action
  setSchemaElements = (elements: Record<string, SchemaElements>): void => {
    this.schemaElements = elements;
  }

  // todo: deprecate
  @action
  setParentNodes = (node_ids: string[]): void => {
    this.parentNodes = node_ids;
  }

  @action
  setNodeAsComposedNode = (node_id: string, composedConfig: Partial<ComposedNodeConf>): void => {
    // wrap normal node as loop node
    const target = findNode(this.schema.node, node_id);
    if (!target) {
      return;
    }
    // const nodeCopy = cloneDeep(target);
    const composedNodeConfig = {
      id: elemId('loop-node'),
      props: {},
      type: 'loop-container',
      // node: nodeCopy,
      loopKey: composedConfig.loopKey || 'id',
      iterableState: composedConfig.iterableState || {},
      node: composedConfig.node || {},
    };

    // console.log('set loop node: ', composedNodeConfig);
    this.replaceNode(node_id, composedNodeConfig as any);
  }

  @action
  updateCurNodeAsComposedNode = (propKey: string, confItem: any): void => {
    // if (!this.rawActiveElem.iterableState) {
    //   // replace current normal node to loop node
    //   this.setNodeAsComposedNode(this.activeElemId, confItem);
    // } else {
    //   // todo: update
    //   this.updateElemProperty(this.activeElemId, propKey, propKey === 'toProps' ? {
    //     args: 'state',
    //     body: confItem || 'return state',
    //     type: 'to_props_function_spec',
    //   } : confItem, { useRawNode: true });
    // }
    this.setNodeAsComposedNode(this.activeElemId, confItem);
  }

  @action
  unsetComposedNode = (loop_node_id: string): void => {
    // reset loop container, lift up inner node
    const composedNode = findNode(this.schema.node, loop_node_id, true);
    if (!composedNode) {
      return;
    }
    if (composedNode.type === 'loop-container') {
      const { node } = composedNode;
      if (node) {
        const { outLayer, children } = node as PageNode;
        if (outLayer) {
          const newNode = { ...outLayer };
          newNode.children = children;
          this.replaceNode(loop_node_id, newNode as PageNode);
        }
      }
      // const innerNode = (loopNode as LoopNode).node;
      // this.replaceNode(loop_node_id, innerNode as PageNode);
    }
  }

  @action
  // 判断节点的父节点是否为布局容器类型（grid）
  isLayoutContainerNode = (node: PageNode): boolean => {
    return findNode(this.schema.node, node.pid)?.exportName === 'grid'
  }

  @action
  setHoverNode=(nodeId: string)=> {
    this.hoverElemId=nodeId;
  }
}

export default new PageStore();
