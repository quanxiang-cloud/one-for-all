import { BehaviorSubject, Subject, noop } from 'rxjs';
import { map, filter, share, skip, delay } from 'rxjs/operators';
import type { APISpecAdapter, FetchParams } from '@one-for-all/api-spec-adapter';
import { logger } from '@one-for-all/utils';

import type { StatesHubAPI, APIState, APIStatesSpec, FetchOption, APIState$WithActions } from '../types';
import getResponseState$, { initialState } from './http/response';

type Cache = Record<string, APIState$WithActions>;

type Props = {
  apiSpecAdapter: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
}
const dummyState$WithAction: APIState$WithActions = {
  state$: new BehaviorSubject<APIState>(initialState),
  fetch: noop,
  refresh: noop,
};

function initState(apiID: string, apiSpecAdapter: APISpecAdapter): APIState$WithActions {
  const params$ = new Subject<FetchParams | undefined>();
  const request$ = params$.pipe(
    // it is adapter's responsibility to handle build error
    // if a error occurred, build should return undefined
    map((params) => apiSpecAdapter.build(apiID, params)),
    filter(Boolean),
    share(),
  );

  let _latestFetchOption: FetchOption | undefined = undefined;
  const apiState$ = getResponseState$(request$, apiSpecAdapter.responseAdapter);

  // execute fetch callback after new `result` emitted from apiState$
  apiState$.pipe(
    skip(1),
    filter(({ loading }) => !loading),
    // because this subscription is happened before than view's,
    // so delay `callback` execution to next frame.
    delay(10),
  ).subscribe((state) => {
    _latestFetchOption?.callback?.(state);
  });

  return {
    state$: apiState$,
    fetch: (fetchOption: FetchOption) => {
      _latestFetchOption = fetchOption;

      params$.next(fetchOption.params);
    },
    refresh: () => {
      if (!_latestFetchOption) {
        return;
      }
      // override onSuccess and onError to undefined
      _latestFetchOption = { params: _latestFetchOption.params };
      params$.next(_latestFetchOption.params);
    },
  };
}

export default class Hub implements StatesHubAPI {
  cache: Cache;
  parentHub?: StatesHubAPI = undefined;

  constructor({ apiStateSpec, apiSpecAdapter }: Props, parentHub?: StatesHubAPI) {
    this.parentHub = parentHub;

    this.cache = Object.entries(apiStateSpec).reduce<Cache>((acc, [stateID, { apiID }]) => {
      acc[stateID] = initState(apiID, apiSpecAdapter);
      return acc;
    }, {});
  }

  hasState$(stateID: string): boolean {
    if (this.cache[stateID]) {
      return true;
    }

    return !!this.parentHub?.hasState$(stateID);
  }

  findState$(stateID: string): APIState$WithActions | undefined {
    if (this.cache[stateID]) {
      return this.cache[stateID];
    }

    return this.parentHub?.findState$(stateID);
  }

  getState$(stateID: string): BehaviorSubject<APIState> {
    const { state$ } = this.findState$(stateID) || {};
    if (state$) {
      return state$;
    }

    logger.error([
      `can't find api state: ${stateID}, please check apiStateSpec or parent schema.`,
      'In order to prevent UI crash, a dummyState$ will be returned.',
    ].join(' '));

    return dummyState$WithAction.state$;
  }

  fetch(stateID: string, fetchOption: FetchOption): void {
    const { fetch } = this.findState$(stateID) || {};
    if (fetch) {
      fetch(fetchOption);
      return;
    }

    logger.error([
      `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
      'this fetch action will be ignored.',
    ].join(' '));
  }

  refresh(stateID: string): void {
    const { refresh } = this.findState$(stateID) || {};
    if (refresh) {
      refresh();
      return;
    }

    logger.error([
      `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
      'this refresh action will be ignored.',
    ].join(' '));
  }
}
