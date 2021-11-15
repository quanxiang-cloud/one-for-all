import { BehaviorSubject } from 'rxjs';

import {
  CTX,
  SharedStates,
  SharedStatesSpec,
} from '../types';

export default class SharedStatesHub implements SharedStates {
  cache: Record<string, BehaviorSubject<any>> = {};
  ctx: CTX | null = null;
  spec: SharedStatesSpec;

  constructor(spec: SharedStatesSpec) {
    this.spec = spec;
  }

  initContext(ctx: CTX): void {
    this.ctx = ctx;
  }

  getState$(stateID: string): BehaviorSubject<any> {
    if (!this.cache[stateID]) {
      this.cache[stateID] = new BehaviorSubject(this.spec[stateID]?.initial);
    }
    return this.cache[stateID];
  }
}
