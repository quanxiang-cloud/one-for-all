import { logger } from '@ofa/utils';
import { BehaviorSubject } from 'rxjs';

import {
  CTX,
  SharedStates,
  SharedStatesSpec,
} from '../types';

export default class SharedStateHub implements SharedStates {
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

  mutateState(stateID: string, state: any): void {
    if (stateID.startsWith('$')) {
      logger.warn('shared stateID can not starts with $, this action will be ignored');
      return;
    }

    this.getState$(stateID).next(state);
  }

  getNodeState$(nodeKey: string): BehaviorSubject<any> {
    const stateID = `$${nodeKey}`;
    return this.getState$(stateID);
  }

  exposeNodeState(nodeKey: string, state: any): void {
    const stateID = `$${nodeKey}`;

    if (!this.cache[stateID]) {
      this.cache[stateID] = new BehaviorSubject(state);
      return;
    }

    this.cache[stateID].next(state);
  }

  retrieveNodeState(nodeKey: string): any {
    const stateID = `$${nodeKey}`;

    if (!this.cache[stateID]) {
      return undefined;
    }

    return this.cache[stateID].getValue();
  }
}
