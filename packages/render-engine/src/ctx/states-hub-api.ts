import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, share, skip, delay } from 'rxjs/operators';
import type { APISpecAdapter, FetchParams } from '@ofa/api-spec-adapter';

import type { StatesHubAPI, APIState, APIStatesSpec, FetchOption } from '../types';
import getResponseState$ from './http/response';

type StateActions = {
  fetch: (fetchOption: FetchOption) => void;
  refresh: () => void;
};

type Props = {
  apiSpecAdapter: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
}

export default class Hub implements StatesHubAPI {
  apiSpecAdapter: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
  cache: Record<string, [BehaviorSubject<APIState>, StateActions]> = {};
  parentHub?: StatesHubAPI = undefined;

  constructor({ apiStateSpec, apiSpecAdapter }: Props, parentHub?: StatesHubAPI) {
    this.apiStateSpec = apiStateSpec;
    this.apiSpecAdapter = apiSpecAdapter;
    this.parentHub = parentHub;
  }

  hasState$(stateID: string): boolean {
    if (this.cache[stateID]) {
      return true;
    }

    return !!this.parentHub?.hasState$(stateID);
  }

  findState$(stateID: string): BehaviorSubject<APIState> | undefined {
    if (this.cache[stateID]) {
      const [state$] = this.cache[stateID];
      return state$;
    }

    return this.parentHub?.findState$(stateID);
  }

  getState$(stateID: string): BehaviorSubject<APIState> {
    const state$ = this.findState$(stateID);
    if (state$) {
      return state$;
    }

    this.initState(stateID);

    return this.cache[stateID][0];
  }

  fetch(stateID: string, fetchOption: FetchOption): void {
    const [, { fetch }] = this.getCached(stateID);

    fetch(fetchOption);
  }

  refresh(stateID: string): void {
    const [, { refresh }] = this.getCached(stateID);

    refresh();
  }

  getCached(stateID: string): [BehaviorSubject<APIState>, StateActions] {
    if (!this.cache[stateID]) {
      this.initState(stateID);
    }

    return this.cache[stateID];
  }

  initState(stateID: string): void {
    const operation = this.apiStateSpec[stateID];
    if (!operation) {
      throw new Error(`no operation for stateID: ${stateID}`);
    }

    const params$ = new Subject<FetchParams | undefined>();
    const request$ = params$.pipe(
      // it is adapter's responsibility to handle build error
      // if a error occurred, build should return undefined
      map((params) => this.apiSpecAdapter.build(operation.apiID, params)),
      filter(Boolean),
      share(),
    );

    let _latestFetchOption: FetchOption | undefined = undefined;
    const apiState$ = getResponseState$(request$, this.apiSpecAdapter.responseAdapter);

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

    const streamActions: StateActions = {
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

    this.cache[stateID] = [apiState$, streamActions];
  }
}
