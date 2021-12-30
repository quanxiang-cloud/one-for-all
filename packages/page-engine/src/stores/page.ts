import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import { defaults, set } from 'lodash';

import { NodePropType, NodeType } from '@ofa/render-engine';
import { elemId } from '../utils';
import { findNode, removeNode as removeTreeNode } from '../utils/tree-utils';
import registry from './registry';
import dataSource from './data-source';
import type { DragPos, PageNode, PageSchema, SourceElement } from '../types';
import { mapRawProps, mergeProps, transformLifecycleHooks } from '../utils/schema-adapter';
import { STYLE_NUMBER } from '../config/default-styles';

type Mode = 'design' | 'preview'

type AppendNodeOptions = {
  renewId?: boolean;
  from?: 'source' | 'canvas';
  [key: string]: any
}

function deepMergeNode(node: PageNode): PageNode {
  const target = toJS(node);
  Object.assign(target, { id: elemId(node.type || NodeType.ReactComponentNode) });
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
      props: {},
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

  constructor() {
    makeObservable(this);
  }

  @computed
  get activeElem(): any {
    if (!this.activeElemId) {
      return null;
    }
    return findNode(this.schema.node, this.activeElemId);
  }

  @computed
  get activeElemProps(): any {
    return mapRawProps(this.activeElem?.props || {});
  }

  @action
  setSchema = (schema: PageSchema): void => {
    // ignore html node
    if (schema.node.type === NodeType.HTMLNode) {
      return;
    }
    this.schema = schema;

    // init data source when set page schema
    runInAction(()=> {
      // fixme: mock api state
      Object.assign(this.schema.apiStateSpec, {
        getApps: { apiID: 'get:/api/v1/get_apps' },
      });

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
    const targetId = target?.id || this.schema.id;
    const targetNode = findNode(this.schema.node, targetId);

    const params: Partial<PageNode> = {
      id: elemId(node.exportName),
      pid: targetNode.pid || this.schema.node.id,
      // exportName: node.exportName,
      type: NodeType.ReactComponentNode,
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      props: {},
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
            props: {},
            children: [],
          },
        ];
      }
    }

    const srcNode = defaults(node, params);
    if (options?.renewId) {
      Object.assign(srcNode, { id: elemId(srcNode.exportName) });
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
        targetNode?.children?.push(Object.assign({}, srcNode, { pid: targetNode.id }));
        if (srcNode.id && options?.from !== 'source') {
          // remove src node
          const srcParent = findNode(this.schema.node, srcNode.pid);
          if (srcParent && srcParent.children) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const idx = srcParent.children.findIndex((v: PageNode) => v.id === node.id);
            if (idx > -1) {
              srcParent.children.splice(idx, 1);
            }
          }
        }
        return;
      }

      if (this.dragPos === 'down') {
        this.insertAfter(srcNode as PageNode, targetNode);
      }
    }
  }

  @action
  insertBefore = (node: PageNode, target: PageNode): void => {
    const srcParent = findNode(this.schema.node, node.pid);
    const targetParent = findNode(this.schema.node, target.pid);
    // remove node from src parent
    if (srcParent && srcParent.children) {
      const idx = srcParent.children.findIndex((v: PageNode) => v.id === node.id);
      if (idx > -1) {
        srcParent.children.splice(idx, 1);
      }
    }

    if (targetParent && targetParent.children) {
      const idx = targetParent.children.findIndex((v: PageNode) => v.id === target.id);
      if (idx > -1) {
        if (idx === 0) {
          targetParent.children.unshift(node);
        } else {
          targetParent.children.splice(idx, 0, node);
        }
      }
    }
  }

  @action
  insertAfter = (node: PageNode, target: PageNode): void => {
    const srcParent = findNode(this.schema.node, node.pid);
    const targetParent = findNode(this.schema.node, target.pid);

    if (srcParent && srcParent.children) {
      const idx = srcParent.children.findIndex((v: PageNode) => v.id === node.id);
      if (idx > -1) {
        srcParent.children.splice(idx, 1);
      }
    }

    if (!target.pid) {
      // removeTreeNode(this.schema, node?.id);
      // append to page
      targetParent.children.push(Object.assign({}, node, { pid: targetParent.id }));
      return;
    }

    if (targetParent && targetParent.children) {
      const idx = targetParent.children.findIndex((v: PageNode) => v.id === target.id);
      if (idx > -1) {
        // double check node pid
        Object.assign(node, { pid: targetParent.id });
        targetParent.children.splice(idx + 1, 0, node);
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
  }

  @action
  updateElemProperty = (elem_id: string, propKey: string, conf: any): void => {
    const elem = findNode(this.schema.node, elem_id);
    if (elem) {
      console.log('update node props: ', elem_id, propKey, conf);
      if (propKey === 'props') {
        set(elem, propKey, mergeProps(toJS(this.activeElem?.props), conf));
      } else if (propKey === 'props.style') {
        // fixme: style bind variable
        set(elem, propKey, { type: NodePropType.ConstantProperty, value: conf });
      } else if (propKey === 'lifecycleHooks') {
        set(elem, propKey, transformLifecycleHooks(conf));
      } else {
        set(elem, propKey, conf);
      }
    }
  }

  getElemDefaultStyle=(type: string)=> {
    const elem = registry.getElemByType(type);
    return toJS(elem?.defaultStyle || {});
  }

  formatStyles = (styles: Record<string, string | number>): Record<string, string | number> => {
    // console.log('format style: ', styles);
    const newStyles: Record<string, string | number> = {};
    if (typeof (styles) !== 'object' || styles === null) {
      return newStyles;
    }

    Object.entries(styles).forEach((style) => {
      const [key, value] = style;

      if (key === 'backgroundImage') {
        if (value === 'none') return;

        newStyles[key] = `url(${value})`;
        return;
      }

      if (STYLE_NUMBER.includes(key)) {
        newStyles[key] = Number(value) || 0;
        return;
      }
      newStyles[key] = value;
    });

    return newStyles;
  }

  getElemBoundActions=(): string[] =>{
    const elemConf = registry.getElemByType(this.activeElem?.exportName) as SourceElement<any>;
    return ['didMount', 'willUnmount'].concat(elemConf?.exportActions || []);
  }

  @action
  reset = (): void => {
    this.schema = initialPageSchema();
    this.mode = 'design';
    this.activeElemId = '';
    this.dragPos = 'down';
  }
}

export default new PageStore();
