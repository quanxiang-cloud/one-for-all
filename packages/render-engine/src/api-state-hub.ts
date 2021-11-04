import { Observable, of, Subject } from 'rxjs';
import { concatWith, map, skip, withLatestFrom } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';

import SpecInterpreter from './spec-interpreter';

import type { APIInvokeCallBack, APIState, APIStateSpec, CTX, Instantiated, RequestParams } from './types';
import getResponseState$ from './response';

type RunParam = {
  params?: RequestParams;
  onSuccess?: APIInvokeCallBack<Instantiated>;
  onError?: APIInvokeCallBack<Instantiated>;
}

type StreamActions = {
  run: (runParam?: RunParam) => void;
  refresh: () => void;
  // __complete: () => void;
};

function executeCallback(ctx: CTX, state: APIState, runParams?: RunParam): void {
  if (state.loading) {
    return;
  }

  if (state.error) {
    runParams?.onError?.({ ...state, ...ctx, });
    return;
  }

  runParams?.onSuccess?.({ ...state, ...ctx, });
}

export default class APIStateHub {
  specInterpreter: SpecInterpreter;
  // map of stateID and operationID
  apiStateSpec: APIStateSpec;
  statesCache: Record<string, [Observable<APIState>, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, apiStateSpec: APIStateSpec) {
    this.specInterpreter = new SpecInterpreter(apiDoc);
    this.apiStateSpec = apiStateSpec;
  }

  getState(stateID: string): Observable<APIState> {
    const [state$] = this.getStream(stateID);

    // TODO: test error when run convertor
    return state$;
  }

  getAction(stateID: string): (runParam?: RunParam) => void {
    const [, { run }] = this.getStream(stateID);
    return run;
  }

  getStream(stateID: string): [Observable<APIState>, StreamActions] {
    if (!this.apiStateSpec[stateID]) {
      // TODO: log error message
    }

    const key = `${stateID}:${this.apiStateSpec[stateID]}`;
    if (!this.statesCache[key]) {
      this.statesCache[key] = this.initState(stateID);
    }

    return this.statesCache[key];
  }

  refresh(stateID: string): void {
    const [, { refresh }] = this.getStream(stateID);
    refresh();
  }

  initState(stateID: string): [Observable<APIState>, StreamActions] {
    const params$ = new Subject<RequestParams>();
    const request$ = params$.pipe(
      // TODO: catch builder error
      map((params) => this.specInterpreter.buildRequest(this.apiStateSpec[stateID]?.operationID, params)),
    );

    const fullState$ = getResponseState$(request$).pipe(
      // TODO: refine this
      withLatestFrom(of(undefined).pipe(concatWith(params$))),
      map(([state, params]) => ({ ...state, params })),
    );

    let _latestRunParams: RunParam | undefined = undefined;

    // run callbacks after value resolved
    fullState$.pipe(skip(1)).subscribe((state) => {
      setTimeout(() => {
        // todo refactor this
        executeCallback({ ctx: { apiStateHub: this } } , state, _latestRunParams);
      }, 10);
    });

    const streamActions: StreamActions = {
      run: (runParam?: RunParam) => {
        _latestRunParams = runParam;
        params$.next(runParam?.params);
      },
      refresh: () => {
        // override onSuccess and onError to undefined
        _latestRunParams = { params: _latestRunParams?.params };
        params$.next(_latestRunParams?.params);
      },
    };

    return [fullState$, streamActions];
  }
}
