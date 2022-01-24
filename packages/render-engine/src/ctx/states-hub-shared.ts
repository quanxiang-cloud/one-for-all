import React from 'react';
import { logger } from '@one-for-all/utils';
import { BehaviorSubject } from 'rxjs';

import {
  StatesHubShared,
  SharedStatesSpec,
} from '../types';

export default class Hub implements StatesHubShared {
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

  exposeNodeState(nodeKey: React.Key, state: unknown): void {
    const stateID = `$${nodeKey}`;
    if (this.cache[stateID]) {
      this.cache[stateID].next(state);
      return;
    }

    this.createState$(stateID, state);
  }
}
