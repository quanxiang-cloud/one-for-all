import { BehaviorSubject } from 'rxjs';

import { NodePropsCache, ArteryNode } from '../types';

function getNodeIDByPath(path: string): string | undefined {
  const nodePath = path.replace(/\/(.+)\/[0-9]+/g, '/$1');
  return nodePath.split('/').pop();
}

const NODE_SHOULD_NOT_CACHE: ArteryNode['id'][] = ['dummyLoopContainer', 'placeholder-node'];
class Store implements NodePropsCache {
  private cache: Record<string, BehaviorSubject<Record<string, unknown>>>;
  private cacheIDs: Set<string>;

  public constructor(cacheIDs: Set<string>) {
    this.cache = {};
    this.cacheIDs = cacheIDs;
  }

  public shouldCache(nodeID: string): boolean {
    return this.cacheIDs.has(nodeID);
  }

  public initState(path: string): void {
    if (!this.cache[path]) {
      this.cache[path] = new BehaviorSubject({} as Record<string, unknown>);
    }
  }

  public getProps$(parentID: string): BehaviorSubject<Record<string, unknown>> | undefined {
    this.initState(parentID);

    return this.cache[parentID];
  }

  public setProps(path: string, nodeID: ArteryNode['id'] ,props: Record<string, unknown>): void {
    const nodePathID = getNodeIDByPath(path);
    // to avoid reset props while node is dummyLoopContainer or placeholder-node
    // or some meaningless node but use useInstantiateProps to parse specific props
    // like iterableState, shouldRender
    if(!nodePathID || NODE_SHOULD_NOT_CACHE.includes(nodeID) ||!this.shouldCache(nodePathID)) {
      return;
    }

    if (!this.cache[nodePathID]) {
      this.cache[nodePathID] = new BehaviorSubject(props);
      return;
    }

    this.cache[nodePathID].next(props);
  }
}

export default Store;
