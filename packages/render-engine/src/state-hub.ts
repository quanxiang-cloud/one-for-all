import { Observable, of, Subject } from 'rxjs';
import { concatWith, map, skip, withLatestFrom } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';

import { RequestParams } from '@ofa/spec-interpreter/src/types';
import SpecInterpreter from '@ofa/spec-interpreter';

import { APIState, StatesMap } from './types';
import getResponseState$ from './response';

type RunParam = {
  params?: RequestParams;
  onSuccess?: (state: APIState) => void;
  onError?: (state: APIState) => void;
}

type StreamActions = {
  run: (runParam?: RunParam) => void;
  refresh: () => void;
  // __complete: () => void;
};

function executeCallback(state: APIState, runParams?: RunParam): void {
  if (state.loading) {
    return;
  }

  if (state.error) {
    runParams?.onError?.(state);
    return;
  }

  runParams?.onSuccess?.(state);
}

export default class StateHub {
  specInterpreter: SpecInterpreter;
  // map of stateID and operationID
  stateIDMap: StatesMap;
  statesCache: Record<string, [Observable<APIState>, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, stateIDMap: StatesMap) {
    this.specInterpreter = new SpecInterpreter(apiDoc);
    this.stateIDMap = stateIDMap;
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
    if (!this.stateIDMap[stateID]) {
      // TODO: log error message
    }

    const key = `${stateID}:${this.stateIDMap[stateID]}`;
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
      map((params) => this.specInterpreter.buildRequest(this.stateIDMap[stateID]?.operationID, params)),
    );

    const fullState$ = getResponseState$(request$).pipe(
      // TODO: refine this
      withLatestFrom(of(undefined).pipe(concatWith(params$))),
      map(([state, params]) => ({ ...state, params })),
    );

    // run callbacks after value resolved
    fullState$.pipe(skip(1)).subscribe((state) => {
      setTimeout(() => {
        executeCallback(state, _latestRunParams);
      }, 10);
    });

    let _latestRunParams: RunParam | undefined = undefined;

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
