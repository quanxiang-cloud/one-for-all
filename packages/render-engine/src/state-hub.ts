import { Observable, of, Subject } from 'rxjs';
import { concatWith, map, withLatestFrom } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';

import { RequestParams } from '@ofa/spec-interpreter/src/types';
import SpecInterpreter from '@ofa/spec-interpreter';

import { APIState } from './types';
import getResponseState$ from './response';

type StreamActions = {
  run: (params?: RequestParams) => void;
  refresh: () => void;
  // __complete: () => void;
};

export default class StateHub {
  specInterpreter: SpecInterpreter;
  // map of stateID and operationID
  stateIDMap: Record<string, string>;
  streamCache: Record<string, [Observable<APIState>, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, stateIDMap: Record<string, string>) {
    this.specInterpreter = new SpecInterpreter(apiDoc);
    this.stateIDMap = stateIDMap;
  }

  getState(stateID: string): Observable<APIState> {
    const [state$] = this.getStream(stateID);

    // todo test error when run convertor
    return state$;
  }

  getAction(stateID: string): (...args: any[]) => void {
    const [, { run: next }] = this.getStream(stateID);
    return next;
  }

  getStream(stateID: string): [Observable<APIState>, StreamActions] {
    if (!this.stateIDMap[stateID]) {
      // todo log error message
    }

    const key = `${stateID}:${this.stateIDMap[stateID]}`;
    if (!this.streamCache[key]) {
      this.streamCache[key] = this.initState(stateID);
    }

    return this.streamCache[key];
  }

  initState(stateID: string): [Observable<APIState>, StreamActions] {
    const params$ = new Subject<RequestParams>();
    const request$ = params$.pipe(
      map((params) => this.specInterpreter.buildRequest(this.stateIDMap[stateID], params)),
    );

    const fullState$ = getResponseState$(request$).pipe(
      // todo refine this
      withLatestFrom(of(undefined).pipe(concatWith(params$))),
      map(([state, params]) => ({ ...state, params })),
    );

    let _latestParams: RequestParams = undefined;

    const streamActions: StreamActions = {
      run: (params: RequestParams) => {
        params$.next(params);
        _latestParams = params;
      },
      refresh: () => {
        params$.next(_latestParams);
      },
    };

    return [fullState$, streamActions];
  }
}
