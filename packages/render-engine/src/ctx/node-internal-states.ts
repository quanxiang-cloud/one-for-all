import { BehaviorSubject } from 'rxjs';

class NodeInternalStates {
  cache: Record<string, BehaviorSubject<any>> = {};

  getState$(nodeID: string): BehaviorSubject<any> {
    if (!this.cache[nodeID]) {
      this.cache[nodeID] = new BehaviorSubject(undefined);
    }

    return this.cache[nodeID];
  }

  expose(nodeID: string, state: any): void {
    if (!this.cache[nodeID]) {
      this.cache[nodeID] = new BehaviorSubject(state);
      return;
    }

    this.cache[nodeID].next(state);
  }

  retrieve(nodeID: string): any {
    if (!this.cache[nodeID]) {
      return undefined;
    }

    return this.cache[nodeID].getValue();
  }
}

export default NodeInternalStates;
