import { logger } from '@one-for-all/utils';
import { BehaviorSubject } from 'rxjs';

import { StatesHubShared, SharedStatesSpec } from '../types';

export default class Hub implements StatesHubShared {
  public cache: Record<string, BehaviorSubject<unknown>>;
  public parentHub?: StatesHubShared = undefined;
  public unWriteableStates: string[] = [];

  public constructor(spec: SharedStatesSpec, parentHub?: StatesHubShared) {
    this.parentHub = parentHub;
    this.cache = Object.entries(spec).reduce<Record<string, BehaviorSubject<unknown>>>(
      (acc, [stateID, { initial, writeable }]) => {
        acc[stateID] = new BehaviorSubject(initial);
        if (writeable === false) {
          this.unWriteableStates.push(stateID);
        }
        return acc;
      },
      {},
    );
  }

  public hasState$(stateID: string): boolean {
    if (this.cache[stateID]) {
      return true;
    }

    return !!this.parentHub?.hasState$(stateID);
  }

  private _createState$(stateID: string, initialValue?: unknown): void {
    this.cache[stateID] = new BehaviorSubject(initialValue);
  }

  public findState$(stateID: string): BehaviorSubject<unknown> | undefined {
    if (this.cache[stateID]) {
      return this.cache[stateID];
    }

    return this.parentHub?.findState$(stateID);
  }

  public getState$(stateID: string): BehaviorSubject<unknown> {
    const state$ = this.findState$(stateID);
    if (state$) {
      return state$;
    }

    this._createState$(stateID);

    return this.cache[stateID];
  }

  public mutateState(stateID: string, state: unknown): void {
    if (stateID.startsWith('$')) {
      logger.warn('shared stateID can not starts with $, this action will be ignored');
      return;
    }

    if (this.unWriteableStates.includes(stateID)) {
      logger.warn('this shared state is not allowed to be written, this action will be ignored');
      return;
    }

    this.getState$(stateID).next(state);
  }

  public getNodeState$(nodePath: string): BehaviorSubject<unknown> {
    const stateID = `$${nodePath}`;
    return this.getState$(stateID);
  }

  public exposeNodeState(nodePath: string, state: unknown): void {
    const stateID = `$${nodePath}`;
    if (this.cache[stateID]) {
      this.cache[stateID].next(state);
      return;
    }

    this._createState$(stateID, state);
  }
}
