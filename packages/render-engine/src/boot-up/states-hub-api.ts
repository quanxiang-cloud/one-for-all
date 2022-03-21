import { BehaviorSubject, noop } from 'rxjs';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import { logger } from '@one-for-all/utils';

import type { StatesHubAPI, APIState, APIStatesSpec, FetchOption, APIState$WithActions } from '../types';
import { initialState } from './http/response';
import initAPIState from './init-api-state';

type Cache = Record<string, APIState$WithActions>;

interface Props {
  apiSpecAdapter?: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
  parentHub?: StatesHubAPI;
}

const dummyState$WithAction: APIState$WithActions = {
  state$: new BehaviorSubject<APIState>(initialState),
  fetch: noop,
  refresh: noop,
};

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

export default class Hub implements StatesHubAPI {
  public cache: Cache;
  public parentHub?: StatesHubAPI = undefined;

  public constructor({ apiStateSpec, apiSpecAdapter, parentHub }: Props) {
    this.parentHub = parentHub;

    this.cache = Object.entries(apiStateSpec).reduce<Cache>((acc, [stateID, { apiID }]) => {
      acc[stateID] = initAPIState(apiID, apiSpecAdapter || dummyAPISpecAdapter);
      return acc;
    }, {});
  }

  public hasState$(stateID: string): boolean {
    if (this.cache[stateID]) {
      return true;
    }

    return !!this.parentHub?.hasState$(stateID);
  }

  public findState$(stateID: string): APIState$WithActions | undefined {
    if (this.cache[stateID]) {
      return this.cache[stateID];
    }

    return this.parentHub?.findState$(stateID);
  }

  public getState$(stateID: string): BehaviorSubject<APIState> {
    const { state$ } = this.findState$(stateID) || {};
    if (state$) {
      return state$;
    }

    logger.error(
      [
        `can't find api state: ${stateID}, please check apiStateSpec or parent schema.`,
        'In order to prevent UI crash, a dummyState$ will be returned.',
      ].join(' '),
    );

    return dummyState$WithAction.state$;
  }

  public fetch(stateID: string, fetchOption: FetchOption): void {
    const { fetch } = this.findState$(stateID) || {};
    if (fetch) {
      fetch(fetchOption);
      return;
    }

    logger.error(
      [
        `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
        'this fetch action will be ignored.',
      ].join(' '),
    );
  }

  public refresh(stateID: string): void {
    const { refresh } = this.findState$(stateID) || {};
    if (refresh) {
      refresh();
      return;
    }

    logger.error(
      [
        `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
        'this refresh action will be ignored.',
      ].join(' '),
    );
  }
}
