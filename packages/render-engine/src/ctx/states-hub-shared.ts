import React from 'react';
import { logger } from '@ofa/utils';
import { BehaviorSubject } from 'rxjs';

import {
  StatesHubShared,
  SharedStatesSpec,
} from '../types';

export default class SharedStateHub implements StatesHubShared {
  cache: Record<string, BehaviorSubject<unknown>>;
  parentHub?: StatesHubShared = undefined;

  constructor(spec: SharedStatesSpec, parentHub?: StatesHubShared) {
    this.parentHub = parentHub;
    this.cache = Object.entries(spec)
      .reduce<Record<string, BehaviorSubject<unknown>>>((acc, [stateID, { initial }]) => {
        acc[stateID] = new BehaviorSubject(initial);

        return acc;
      }, {});
  }

  hasState$(stateID: string): boolean {
    if (this.cache[stateID]) {
      return true;
    }

    return !!this.parentHub?.hasState$(stateID);
  }

  createState$(stateID: string, initialValue?: unknown): void {
    this.cache[stateID] = new BehaviorSubject(initialValue);
  }

  findState$(stateID: string): BehaviorSubject<unknown> | undefined {
    if (this.cache[stateID]) {
      return this.cache[stateID];
    }

    return this.parentHub?.findState$(stateID);
  }

  getState$(stateID: string): BehaviorSubject<unknown> {
    const state$ = this.findState$(stateID);
    if (state$) {
      return state$;
    }

    this.createState$(stateID);

    return this.cache[stateID];
  }

  getState(stateID: string): unknown {
    return this.getState$(stateID).getValue();
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

    if (!this.hasState$(stateID)) {
      this.createState$(stateID, state);
      return;
    }

    this.cache[stateID].next(state);
  }

  retrieveNodeState(nodeKey: string): unknown {
    return this.getNodeState$(nodeKey).value;
  }
}
