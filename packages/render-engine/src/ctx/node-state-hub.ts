import { BehaviorSubject } from 'rxjs';

class NodeStateHub {
  cache: Record<string, BehaviorSubject<any>> = {};

  getState$(nodeKey: string): BehaviorSubject<any> {
    if (!this.cache[nodeKey]) {
      this.cache[nodeKey] = new BehaviorSubject(undefined);
    }

    return this.cache[nodeKey];
  }

  expose(nodeKey: string, state: any): void {
    if (!this.cache[nodeKey]) {
      this.cache[nodeKey] = new BehaviorSubject(state);
      return;
    }

    this.cache[nodeKey].next(state);
  }

  retrieve(nodeID: string): any {
    if (!this.cache[nodeID]) {
      return undefined;
    }

    return this.cache[nodeID].getValue();
  }
}

export default NodeStateHub;
