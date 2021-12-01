import React from 'react';
import { logger } from '@ofa/utils';
import { BehaviorSubject } from 'rxjs';

import {
  CTX,
  StatesHubShared,
  SharedStatesSpec,
} from '../types';

export default class SharedStateHub implements StatesHubShared {
  cache: Record<string, BehaviorSubject<unknown>> = {};
  ctx: CTX | null = null;
  spec: SharedStatesSpec;

  constructor(spec: SharedStatesSpec) {
    this.spec = spec;
  }

  initContext(ctx: CTX): void {
    this.ctx = ctx;
  }

  createState$IfNotExist(stateID: string, initialValue: unknown): void {
    if (this.cache[stateID]) {
      return;
    }

    this.cache[stateID] = new BehaviorSubject(initialValue);
  }

  getState$(stateID: string): BehaviorSubject<unknown> {
    this.createState$IfNotExist(stateID, this.spec[stateID]?.initial);

    return this.cache[stateID];
  }

  getState(stateID: string): unknown {
    return this.getState$(stateID)?.getValue();
  }

  mutateState(stateID: string, state: unknown): void {
    if (stateID.startsWith('$')) {
      logger.warn('shared stateID can not starts with $, this action will be ignored');
      return;
    }

    this.getState$(stateID).next(state);
  }

  getNodeState$(nodeKey: string): BehaviorSubject<unknown> {
    const stateID = `$${nodeKey}`;
    return this.getState$(stateID);
  }

  getNodeState(nodeKey: string): unknown {
    const stateID = `$${nodeKey}`;
    return this.getState$(stateID).getValue();
  }

  exposeNodeState(nodeKey: React.Key, state: unknown): void {
    const stateID = `$${nodeKey}`;

    this.createState$IfNotExist(stateID, state);

    this.cache[stateID].next(state);
  }

  retrieveNodeState(nodeKey: string): unknown {
    const stateID = `$${nodeKey}`;

    if (!this.cache[stateID]) {
      return undefined;
    }

    return this.cache[stateID].getValue();
  }
}
