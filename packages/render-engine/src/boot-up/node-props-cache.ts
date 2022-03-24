import { BehaviorSubject } from 'rxjs';

import { NodePropsCache, SchemaNode } from '../types';
import { convertPath } from '../use-instantiate-props/utils';

const NODE_SHOULD_NOT_CACHE: SchemaNode['id'][] = ['dummyLoopContainer', 'placeholder-node'];
class Store implements NodePropsCache {
  private cache: Record<string, BehaviorSubject<unknown>>;
  private cacheIDs: Set<string>;

  public constructor(cacheIDs: Set<string>) {
    this.cache = {};
    this.cacheIDs = cacheIDs;
  }

  public addCacheID(nodeID: string): void {
    if (this.hasCacheID(nodeID)) {
      return;
    }
    this.cacheIDs.add(nodeID);
  }

  public hasCacheID(nodeID: string): boolean {
    return this.cacheIDs.has(nodeID);
  }

  public initState(path: string): void {
    if (!this.cache[path]) {
      this.cache[path] = new BehaviorSubject({} as unknown);
    }
  }

  public getProps$(parentID: string): BehaviorSubject<unknown> | undefined {
    this.initState(parentID);

    return this.cache[parentID];
  }

  public setProps(path: string, nodeID: SchemaNode['id'] ,props: unknown): void {
    const nodePath = convertPath(path);
    const nodePathID = nodePath.split('/').pop();
    // to avoid reset props while node is dummyLoopContainer or placeholder-node
    // or some meaningless node but use useInstantiateProps to parse specific props
    // like iterableState, shouldRender
    if(!nodePathID || NODE_SHOULD_NOT_CACHE.includes(nodeID) ||!this.hasCacheID(nodePathID)) {
      return;
    }

    if (!this.cache[nodePathID]) {
      this.cache[nodePathID] = new BehaviorSubject(props);
      return;
    }

    this.cache[nodePathID].next(props);
  }

  public clearProps(path: string): void {
    if (!this.cache[path]) return;

    this.cache[path].complete();

    delete this.cache[path];
  }
}

export default Store;
