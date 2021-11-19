import { BehaviorSubject, Subject } from 'rxjs';
import { map, skip, filter, share } from 'rxjs/operators';
import type { APISpecAdapter, RequestParams } from '@ofa/api-spec-adapter';

import type { APIStates, APIState, APIStatesSpec, CTX, RunParam } from '../types';
import getResponseState$ from './http/response';

type StreamActions = {
  run: (runParam: RunParam) => void;
  refresh: () => void;
  // __complete: () => void;
};

function executeCallback(ctx: CTX, state: APIState, runParams?: RunParam): void {
  if (state.loading) {
    return;
  }

  if (state.error) {
    runParams?.onError?.call(ctx);
    return;
  }

  runParams?.onSuccess?.call(ctx);
}

export default class APIStateHub implements APIStates {
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

  getState(stateID: string): BehaviorSubject<APIState> {
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

    const params$ = new Subject<RequestParams | undefined>();
    const request$ = params$.pipe(
      // it is adapter's responsibility to handle build error
      // if a error occurred, build should return undefined
      map((params) => this.apiSpecAdapter.build(operation.apiID, params)),
      filter(Boolean),
      share(),
    );

    const apiState$ = getResponseState$(request$);

    let _latestRunParams: RunParam | undefined = undefined;

    // run callbacks after value resolved
    apiState$.pipe(skip(1)).subscribe((state) => {
      setTimeout(() => {
        // todo refactor this
        executeCallback(
          this.ctx as CTX,
          state,
          _latestRunParams,
        );
      }, 10);
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
