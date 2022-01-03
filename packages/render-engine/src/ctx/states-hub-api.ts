import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, share, skip } from 'rxjs/operators';
import type { APISpecAdapter, FetchParams } from '@ofa/api-spec-adapter';

import type {
  StatesHubAPI, APIState, APIStatesSpec, FetchOption, APIFetchCallback,
} from '../types';
import getResponseState$ from './http/response';

type StateActions = {
  fetch: (fetchOption: FetchOption) => void;
  refresh: () => void;
};

function executeCallback(state: APIState, callback: APIFetchCallback): void {
  if (state.loading) {
    return;
  }

  callback(state);
}

export default class APIStatesHub implements StatesHubAPI {
  apiSpecAdapter: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
  statesCache: Record<string, [BehaviorSubject<APIState>, StateActions]> = {};

  constructor(apiSpecAdapter: APISpecAdapter, apiStateSpec: APIStatesSpec) {
    this.apiStateSpec = apiStateSpec;
    this.apiSpecAdapter = apiSpecAdapter;
  }

  getState$(stateID: string): BehaviorSubject<APIState> {
    const [state$] = this.getCached(stateID);

    return state$;
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
    if (!this.statesCache[stateID]) {
      this.initState(stateID);
    }

    return this.statesCache[stateID];
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

    // run callbacks after value resolved
    apiState$.pipe(
      skip(1),
      filter(({ loading }) => {
        return !loading;
      }),
    ).subscribe((state) => {
      // todo refactor this
      if (_latestFetchOption?.callback) {
        const callback = _latestFetchOption.callback;
        setTimeout(() => {
          // todo refactor this
          executeCallback(
            state,
            callback,
          );
        }, 10);
      }
    });

    const streamActions: StateActions = {
      fetch: (fetchOption: FetchOption) => {
        _latestFetchOption = fetchOption;

        params$.next(fetchOption?.params);
      },
      refresh: () => {
        if (!_latestFetchOption) {
          return;
        }
        // override onSuccess and onError to undefined
        _latestFetchOption = { params: _latestFetchOption.params };
        params$.next(_latestFetchOption?.params);
      },
    };

    this.statesCache[stateID] = [apiState$, streamActions];
  }
}
