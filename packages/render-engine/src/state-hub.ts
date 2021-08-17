import { Observable, of, Subject } from 'rxjs';
import { concatWith, map, withLatestFrom } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import { APIState } from './types';
import getResponseState$ from './response';

type ResultConvertor<T> = (result: APIState) => T;
type ActionParamsConvertor = (...args: any[]) => RequestParams;
type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  // __complete: () => void;
};

export default class StateHub {
  requestBuilder: RequestBuilder;
  // map of streamID and operationID
  streamIDMap: Record<string, string>;
  streamCache: Record<string, [Observable<APIState>, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.requestBuilder = new RequestBuilder(apiDoc);
    this.streamIDMap = streamIDMap;
  }

  getValue<T>(streamID: string, convertor: ResultConvertor<T>): Observable<T> {
    const [stateHub$] = this.getStream(streamID);

    // todo test error when run convertor
    return stateHub$.pipe(map(convertor));
  }

  getAction(streamID: string, convertor?: ActionParamsConvertor): (...args: any[]) => void {
    const [, { next }] = this.getStream(streamID);

    return (...args: any[]) => {
      next(convertor?.(...args));
    };
  }

  getStream(streamID: string): [Observable<APIState>, StreamActions] {
    if (!this.streamIDMap[streamID]) {
      // todo log error message
    }

    const key = `${streamID}:${this.streamIDMap[streamID]}`;
    if (!this.streamCache[key]) {
      this.streamCache[key] = this.initState(streamID);
    }

    return this.streamCache[key];
  }

  initState(streamID: string): [Observable<APIState>, StreamActions] {
    const params$ = new Subject<RequestParams>();
    const request$ = params$.pipe(
      map((params) => this.requestBuilder.buildRequest(this.streamIDMap[streamID], params)),
    );

    const fullState$ = getResponseState$(request$).pipe(
      // todo refine this
      withLatestFrom(of(undefined).pipe(concatWith(params$))),
      map(([state, params]) => ({ ...state, params })),
    );

    let _latestParams: RequestParams = undefined;

    const streamActions: StreamActions = {
      next: (params: RequestParams) => {
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
