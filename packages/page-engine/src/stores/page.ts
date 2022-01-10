import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import { cloneDeep, defaults, get, set } from 'lodash';

import { NodePropType, NodeType } from '@ofa/render-engine';
import { LoopNode, LoopNodeConf } from '@ofa/page-engine';
import { elemId, isDev } from '../utils';
import { findNode, findParent, removeNode as removeTreeNode } from '../utils/tree-utils';
import registry from './registry';
import dataSource from './data-source';
import type { DragPos, PageNode, PageSchema, SchemaElements, SourceElement } from '../types';
import { mapRawProps, mergeAsRenderEngineProps, transformLifecycleHooks } from '../utils/schema-adapter';

type Mode = 'design' | 'preview'

type AppendNodeOptions = {
  renewId?: boolean;
  from?: 'source' | 'canvas';
  [key: string]: any
}

function deepMergeNode(node: PageNode): PageNode {
  const target = toJS(node);
  Object.assign(target, { id: elemId(node.exportName) });
  if (target.children) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.children = target.children.map(deepMergeNode);
  }
  return target;
}

function initialPageSchema(): PageSchema {
  return {
    node: {
      id: elemId('page'),
      pid: '',
      type: NodeType.ReactComponentNode,
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      exportName: 'page', // todo
      label: '页面',
      props: {
        style: {
          type: NodePropType.ConstantProperty,
          value: {
            width: '100%',
            height: '100%',
          },
        },
      },
      children: [],
    },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
}

class PageStore {
  @observable schema: PageSchema = initialPageSchema()
  @observable mode: Mode = 'design'
  @observable activeElemId = ''
  @observable dragPos: DragPos = 'down'
  @observable schemaElements: Record<string, SchemaElements> = {}
  @observable parentNodes: string[]=[] // canvas cur node's parents

  constructor() {
    makeObservable(this);
  }

  @computed
  get rawActiveElem(): any {
    if (!this.activeElemId) {
      return null;
    }

    return findNode(this.schema.node, this.activeElemId);
  }

  @computed
  get activeElem(): any {
    const node = this.rawActiveElem;
    if (node?.type === NodeType.LoopContainerNode) {
      return node.node;
    }
    return node;
  }

  @computed
  get activeElemProps(): any {
    return mapRawProps(this.activeElem?.props || {});
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
    if (schema.node.type === NodeType.HTMLNode) {
      return;
    }

    this.schema = schema || initialPageSchema();

    // init data source when set page schema
    runInAction(()=> {
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

  @action
  appendNode = (node: Omit<PageNode, 'type'| 'id'>, target?: Omit<PageNode, 'type' | 'id'> | null, options?: AppendNodeOptions): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const targetId = target?.id || this.schema.node.id;
    const targetNode = findNode(this.schema.node, targetId);

    const params: Partial<PageNode> = {
      id: elemId(node.exportName),
      pid: this.dragPos === 'inner' ? targetNode.id : (targetNode.pid || this.schema.node.id),
      // exportName: node.exportName,
      type: NodeType.ReactComponentNode,
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      props: {
        style: {
          type: NodePropType.ConstantProperty,
          value: node.defaultStyle || {},
        },
      },
    };

    if (registry.acceptChild(node.exportName)) {
      Object.assign(params, { children: [] });
      // check layout comps
      if (node.exportName === 'grid') {
        const subComp = 'container';
        params.children = [
          {
            id: elemId(subComp),
            pid: params.id,
            type: NodeType.ReactComponentNode,
            exportName: subComp,
            packageName: 'ofa-ui',
            packageVersion: 'latest',
            label: '容器',
            props: {
              style: {
                type: NodePropType.ConstantProperty,
                value: node.defaultStyle || {},
              },
            },
            children: [],
          },
        ];
      }
    }

    let srcNode = defaults(node, params);
    if (options?.renewId) {
      Object.assign(srcNode, { id: elemId(srcNode.exportName) });
    }

    // check if srcNode already in page
    const foundNode = findNode(this.schema.node, srcNode.id);
    if (foundNode) {
      srcNode = cloneDeep(foundNode);
    }

    if (targetNode) {
      // console.log('append node: ', toJS(srcNode), toJS(targetNode), this.dragPos);

      if (this.dragPos === 'up') {
        this.insertBefore(srcNode as PageNode, targetNode);
        return;
      }

      if (this.dragPos === 'inner') {
        if (!targetNode.children) {
          return;
        }
        if (srcNode.id && options?.from !== 'source') {
          const srcParent = findNode(this.schema.node, srcNode.pid);
          if (srcParent && srcParent.children) {
            const isLoopNode = srcNode.type === NodeType.LoopContainerNode;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const srcNodeId = isLoopNode ? srcNode.node.id : srcNode.id;

            const idx = srcParent.children.findIndex((v: PageNode) => v.id === srcNodeId || v.id === srcNode.id);
            if (idx > -1) {
              // remove src node
              srcParent.children.splice(idx, 1);

              // append to target
              if (isLoopNode) {
                set(srcNode, 'node.pid', targetNode.id);
              }
              targetNode?.children?.push(Object.assign(srcNode, { pid: targetNode.id }));
            }
          }
        } else {
          // from source panel
          targetNode?.children?.push(Object.assign(srcNode, { pid: targetNode.id }));
        }
        return;
      }

      if (this.dragPos === 'down') {
        this.insertAfter(srcNode as PageNode, targetNode);
      }
    }
  }

  getRealNode=(rawNode: PageNode): PageNode=> {
    return rawNode.type === NodeType.LoopContainerNode ? (rawNode as any).node : rawNode;
  }

  @action
  insertBefore = (rawNode: PageNode, target: PageNode): void => {
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
          targetParent.children.splice(targetIdx, 0, newNode);
        }
      }
    }
  }

  @action
  insertAfter = (rawNode: PageNode, target: PageNode): void => {
    const node = this.getRealNode(rawNode);
    const srcParent = findNode(this.schema.node, node.pid);
    const targetParent = findNode(this.schema.node, target.pid);
    let srcIdx = -1; // node in src parent idx
    let targetIdx = -1; // node in target parant idx

    if (srcParent && srcParent.children) {
      srcIdx = srcParent.children.findIndex((v: PageNode) => v.id === node.id || v.id === rawNode.id);
    }

    if (!target.pid) {
      removeTreeNode(this.schema.node, node.id);
      // append to page
      set(node, 'pid', targetParent.id);
      targetParent.children.push(Object.assign(rawNode, { pid: targetParent.id }));
      return;
    }

    if (targetParent && targetParent.children) {
      targetIdx = targetParent.children.findIndex((v: PageNode) => v.id === target.id);
      if (srcIdx > -1 && targetIdx > -1) {
        // remove node in src parent
        srcParent.children.splice(srcIdx, 1);

        // add node in target parent, double check node pid
        set(node, 'pid', targetParent.id);
        targetParent.children.splice(targetIdx + 1, 0, Object.assign(rawNode, { pid: targetParent.id }));
      }
    }
  }

  @action
  copyNode = (pid: string, id: string): void => {
    const parent = findNode(this.schema.node, pid);
    const srcNode = findNode(this.schema.node, id);
    if (parent && parent.children) {
      const srcIdx = parent.children.indexOf(srcNode);
      if (srcIdx > -1) {
        parent.children.splice(srcIdx, 0, deepMergeNode(srcNode));
      }
    }
  }

  @action
  removeNode = (id: string): void => {
    removeTreeNode(this.schema.node, id);
    this.activeElemId = '';
  }

  @action
  updateElemProperty = (elem_id: string, propKey: string, conf: any, options?: Record<string, any>): void => {
    const elem = findNode(this.schema.node, elem_id);
    if (elem) {
      let actualNode = elem;
      if (!options?.useRawNode && elem.type === NodeType.LoopContainerNode) {
        actualNode = elem.node;
      }

      // isDev() && console.log('update node props: ', elem_id, toJS(actualNode), propKey, conf);

      if (propKey === 'props') {
        set(actualNode, propKey, mergeAsRenderEngineProps(toJS(this.activeElem?.props), conf));
      } else if (propKey === 'props.style') {
        // fixme: style bind variable
        set(actualNode, propKey, { type: NodePropType.ConstantProperty, value: conf });
      } else if (propKey === 'lifecycleHooks') {
        set(actualNode, propKey, transformLifecycleHooks(conf));
      } else {
        set(actualNode, propKey, conf);
      }
    }
  }

  getElemBoundActions=(): string[] =>{
    const elemConf = registry.getElemByType(this.activeElem?.exportName) as SourceElement<any>;
    return ['didMount', 'willUnmount'].concat(elemConf?.exportActions || []);
  }

  @action
  replaceNode=(node_id: string, replaced: PageNode): void=> {
    const parent = findParent(this.schema.node, node_id);
    if (parent) {
      const srcIdx = parent.children?.findIndex((v)=> v.id === node_id || get(v, 'node.id') === node_id) ?? -1;
      if (srcIdx > -1) {
        parent.children?.splice(srcIdx, 1, replaced);
      }
    }
  }

  @action
  setNodeAsLoopContainer=(node_id: string, loopConfig: Partial<LoopNodeConf>): void => {
    // wrap normal node as loop node
    const target = findNode(this.schema.node, node_id);
    if (!target) {
      return;
    }
    const nodeCopy = cloneDeep(target);
    const loopNodeConfig = {
      id: elemId('loop-node'),
      type: NodeType.LoopContainerNode,
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
  updateCurNodeAsLoopContainer=(propKey: string, confItem: any): void=> {
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
  unsetLoopNode=(loop_node_id: string): void => {
    // reset loop container, lift up inner node
    const loopNode = findNode(this.schema.node, loop_node_id);
    if (!loopNode) {
      return;
    }
    if (loopNode.type === NodeType.LoopContainerNode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const innerNode = (loopNode as LoopNode).node;
      this.replaceNode(loop_node_id, innerNode as PageNode);
    }
  }

  @action
  reset = (): void => {
    this.schema = initialPageSchema();
    this.mode = 'design';
    this.activeElemId = '';
    this.dragPos = 'down';
  }

  @action
  setSchemaElements = (elements: Record<string, SchemaElements>): void => {
    this.schemaElements = elements;
  }

  @action
  setParentNodes=(node_ids: string[])=> {
    this.parentNodes = node_ids;
  }
}

export default new PageStore();
