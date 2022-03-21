import { BehaviorSubject } from 'rxjs';
import { NodePropsCache, SchemaNode } from '../types';
import { convertPath } from '../use-instantiate-props/utils';

const NODE_SHOULD_NOT_CACHE: SchemaNode['id'][] = ['dummyLoopContainer', 'placeholder-node'];
class Store implements NodePropsCache {
  cache: Record<string, BehaviorSubject<unknown>>;
  cacheIDs: Set<string>;

  constructor(cacheIDs: Set<string>) {
    this.cache = {};
    this.cacheIDs = cacheIDs;
  }

  addCacheID(nodeID: string): void {
    if (this.hasCacheID(nodeID)) {
      return;
    }
    this.cacheIDs.add(nodeID);
  }

  hasCacheID(nodeID: string): boolean {
    return this.cacheIDs.has(nodeID);
  }

  initState(path: string) {
    if (!this.cache[path]) {
      this.cache[path] = new BehaviorSubject({} as unknown);
    }
  }

  getProps$(path: string, parentIndex: number): BehaviorSubject<unknown> | undefined {
    const nodePath = convertPath(path).split('/');
    const parentPath = nodePath.slice(0, nodePath.length - (parentIndex + 1)).join('/');
    this.initState(parentPath);

    return this.cache[parentPath];
  }

  setProps(path: string, nodeID: SchemaNode['id'] ,props: unknown): void {
    const nodePath = convertPath(path);
    const nodePathID = nodePath.split('/').pop();
    // to avoid reset props while node is dummyLoopContainer or placeholder-node
    // or some meaningless node but use useInstantiateProps to parse specific props
    // like iterableState, shouldRender
    if(!nodePathID || NODE_SHOULD_NOT_CACHE.includes(nodeID) ||!this.hasCacheID(nodePathID)) {
      return;
    }

    if (!this.cache[nodePath]) {
      this.cache[nodePath] = new BehaviorSubject(props);
      return;
    }

    this.cache[nodePath].next(props);
  }

  clearProps(path: string): void {
    if (!this.cache[path]) return;

    this.cache[path].complete();

    delete this.cache[path];
  }
}

export default Store;
