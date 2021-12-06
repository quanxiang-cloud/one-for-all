import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, share, skip } from 'rxjs/operators';
import type { APISpecAdapter, FetchParams } from '@ofa/api-spec-adapter';

import type {
  StatesHubAPI, APIState, APIStatesSpec, CTX, RunParam, APIFetch, APIFetchCallback,
} from '../types';
import getResponseState$ from './http/response';

type StreamActions = {
  run: (runParam: RunParam) => void;
  refresh: () => void;
};

function executeCallback(ctx: CTX, state: APIState, callback: APIFetchCallback): void {
  if (state.loading) {
    return;
  }

  callback(state);
}

export default class APIStatesHub implements StatesHubAPI {
  apiSpecAdapter: APISpecAdapter;
  apiStateSpec: APIStatesSpec;
  statesCache: Record<string, [BehaviorSubject<APIState>, StreamActions]> = {};
  ctx: CTX | null = null;

  constructor(apiSpecAdapter: APISpecAdapter, apiStateSpec: APIStatesSpec) {
    this.apiStateSpec = apiStateSpec;
    this.apiSpecAdapter = apiSpecAdapter;
  }

  initContext(ctx: CTX): void {
    this.ctx = ctx;
  }

  getState$(stateID: string): BehaviorSubject<APIState> {
    const [state$] = this.getCached(stateID);

    return state$;
  }

  runAction(stateID: string, runParam: RunParam): void {
    const [, { run }] = this.getCached(stateID);

    run(runParam);
  }

  refresh(stateID: string): void {
    const [, { refresh }] = this.getCached(stateID);

    refresh();
  }

  getFetch(stateID: string): APIFetch {
    return (fetchParams: FetchParams, callback?: APIFetchCallback): void => {
      // todo implement callback
      this.runAction(stateID, { params: fetchParams, callback });
    };
  }

  getCached(stateID: string): [BehaviorSubject<APIState>, StreamActions] {
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

    let _latestRunParams: RunParam | undefined = undefined;
    const apiState$ = getResponseState$(request$, this.apiSpecAdapter);

    // run callbacks after value resolved
    apiState$.pipe(
      skip(1),
      filter(({ loading }) => {
        return !loading;
      }),
    ).subscribe((state) => {
      // todo refactor this
      if (_latestRunParams?.callback) {
        const callback = _latestRunParams.callback;
        setTimeout(() => {
          // todo refactor this
          executeCallback(
            this.ctx as CTX,
            state,
            callback,
          );
        }, 10);
      }
    });

    const streamActions: StreamActions = {
      run: (runParam: RunParam) => {
        _latestRunParams = runParam;

        params$.next(runParam?.params);
      },
      refresh: () => {
        if (!_latestRunParams) {
          return;
        }
        // override onSuccess and onError to undefined
        _latestRunParams = { params: _latestRunParams.params };
        params$.next(_latestRunParams?.params);
      },
    };

    this.statesCache[stateID] = [apiState$, streamActions];
  }
}
