import { observable, computed, action, makeObservable, toJS } from 'mobx';
import { defaults, set } from 'lodash';

import { elemId } from '../utils';
import { findNode } from '../utils/tree-utils';
import registry from './registry';
import dataSource from './data-source';

type Mode = 'design' | 'preview'
type AppendNodeOptions = {
  renewId?: boolean;
  from?: 'source' | 'canvas';
  [key: string]: any
}

function deepMergeNode(node: PageEngine.Node): PageEngine.Node {
  const target = toJS(node);
  Object.assign(target, { id: elemId(node.comp) });
  if (target.children) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.children = target.children.map(deepMergeNode);
  }
  return target;
}

function pageInitialSchema(): PageEngine.Node {
  return {
    id: elemId('page'),
    pid: '',
    comp: 'page',
    label: '页面',
    props: {},
    children: [],
    _shared: {},
    _api: {},
  };
}

class PageStore {
  @observable schema: PageEngine.Node = pageInitialSchema()
  @observable mode: Mode = 'design'
  @observable activeElemId = ''
  @observable dragPos: PageEngine.DragPos = 'down'

  constructor() {
    makeObservable(this);
  }

  @computed
  get activeElem() {
    if (!this.activeElemId) {
      return null;
    }
    return findNode(this.schema, this.activeElemId);
  }

  @action
  setSchema = (schema: PageEngine.Node): void => {
    this.schema = schema;
    dataSource.sharedState = schema._shared || {};
    dataSource.apiState = schema._api || {};
  }

  @action
  setPageSharedStates=(states: any)=> {
    Object.assign(this.schema._shared, states);
  }

  @action
  setPageApiStates=(states: any)=> {
    Object.assign(this.schema._api, states);
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
  setDragPos = (pos: PageEngine.DragPos): void => {
    this.dragPos = pos;
  }

  @action
  appendNode = (node: PageEngine.Node, target?: PageEngine.Node | null, options?: AppendNodeOptions): void => {
    const targetId = target?.id || this.schema.id;
    const targetNode = findNode(this.schema, targetId);

    const params: any = {
      id: elemId(node.comp),
      pid: targetNode.pid || this.schema.id,
      props: {},
    };

    if (registry.acceptChild(node.comp)) {
      Object.assign(params, { children: [] });
      // check layout comps
      if (node.comp === 'elem.grid') {
        const subComp = 'elem.container';
        params.children = [
          { comp: subComp, id: elemId(subComp), pid: params.id, label: '容器', props: {}, children: [] },
        ];
      }
    }

    const srcNode = defaults(node, params);
    if (options?.renewId) {
      Object.assign(srcNode, { id: elemId(srcNode.comp) });
    }

    if (targetNode) {
      console.log('append node: ', toJS(srcNode), toJS(targetNode), this.dragPos);

      if (this.dragPos === 'up') {
        this.insertBefore(srcNode, targetNode);
        return;
      }

      if (this.dragPos === 'inner') {
        if (!targetNode.children) {
          return;
        }
        targetNode?.children?.push(Object.assign({}, srcNode, { pid: targetNode.id }));
        if (srcNode.id && options?.from !== 'source') {
          // remove src node
          const srcParent = findNode(this.schema, srcNode.pid);
          if (srcParent && srcParent.children) {
            const idx = srcParent.children.findIndex((v: PageEngine.Node) => v.id === node.id);
            if (idx > -1) {
              srcParent.children.splice(idx, 1);
            }
          }
        }
        return;
      }

      if (this.dragPos === 'down') {
        this.insertAfter(srcNode, targetNode);
      }
    }
  }

  @action
  insertBefore = (node: PageEngine.Node, target: PageEngine.Node): void => {
    const srcParent = findNode(this.schema, node.pid);
    const targetParent = findNode(this.schema, target.pid);
    // remove node from src parent
    if (srcParent && srcParent.children) {
      const idx = srcParent.children.findIndex((v: PageEngine.Node) => v.id === node.id);
      if (idx > -1) {
        srcParent.children.splice(idx, 1);
      }
    }

    if (targetParent && targetParent.children) {
      const idx = targetParent.children.findIndex((v: PageEngine.Node) => v.id === target.id);
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
  insertAfter = (node: PageEngine.Node, target: PageEngine.Node): void => {
    const srcParent = findNode(this.schema, node.pid);
    const targetParent = findNode(this.schema, target.pid);

    if (srcParent && srcParent.children) {
      const idx = srcParent.children.findIndex((v: PageEngine.Node) => v.id === node.id);
      if (idx > -1) {
        srcParent.children.splice(idx, 1);
      }
    }

    if (!target.pid) {
      // append to page
      targetParent.children.push(Object.assign({}, node, { pid: targetParent.id }));
      return;
    }

    if (targetParent && targetParent.children) {
      const idx = targetParent.children.findIndex((v: PageEngine.Node) => v.id === target.id);
      if (idx > -1) {
        targetParent.children.splice(idx + 1, 0, node);
      }
    }
  }

  @action
  copyNode = (pid: string, id: string): void => {
    const parent = findNode(this.schema, pid);
    const srcNode = findNode(this.schema, id);
    if (parent && parent.children) {
      const srcIdx = parent.children.indexOf(srcNode);
      parent.children.splice(srcIdx, 0, deepMergeNode(srcNode));
    }
  }

  @action
  removeNode = (pid: string, id: string): void => {
    const parent = findNode(this.schema, pid);
    parent.children = parent.children.filter((c: PageEngine.Node) => c.id !== id);
  }

  @action
  updateElemProperty = (elem_id: string, propKey: string, conf: Record<string, any>): void => {
    const elem = findNode(this.schema, elem_id);
    if (elem) {
      set(elem, propKey, conf);
    }
  }

  @action
  updateElemProps=(elem_id: string, props: Record<string, any>)=> {
    this.updateElemProperty(elem_id, 'props', props);
  }

  @action
  reset = (): void => {
    // todo
  }
}

export default new PageStore();
