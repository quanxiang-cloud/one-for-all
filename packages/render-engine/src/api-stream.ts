import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, BehaviorSubject, Observable } from 'rxjs';
import {
  tap, map, switchMap, catchError, share, startWith, pairwise, filter, withLatestFrom, skip,
} from 'rxjs/operators';
import { noop } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig } from '@ofa/request-builder/src';
import { RequestParams } from '@ofa/request-builder/src/types';

import { APIResult, APIResult$ } from './types';

// API Stream State Table
/*
    |     | loading |   body    |   error   |
    | --- | :-----: | :-------: | :-------: |
    | 1   |  false  | undefined | undefined | (ignored)
    | 2   |  true   | undefined | undefined |
┌──►| 3   |  false  |    {}     | undefined |◄────┐
└───| 4   |  true   |    {}     | undefined |     │
    | 5   |  false  | undefined |    xxx    |     │
    | 6   |  true   | undefined |    xxx    |─────┘
*/

export type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  _complete: () => void;
};

type ResultConvertor<T> = (result: APIResult) => T;
type ActionParamsConvertor = (...args: any[]) => RequestParams;

function requestConfigToAjaxRequest(config: RequestConfig): AjaxRequest {
  return {
    method: config.method,
    url: config.path,
    headers: {
      'Content-Type': 'application/json',
    },
    async: true,
    timeout: 1000,
    crossDomain: false,
    withCredentials: false,
    responseType: 'json',
  };
}

function createAPIResult$(operationID: string, requestBuilder: RequestBuilder): [APIResult$, StreamActions] {
  const loading$ = new BehaviorSubject<boolean>(false);
  const params$ = new BehaviorSubject<RequestParams | undefined>(undefined);
  const response$: Observable<Pick<APIResult, 'body' | 'error'>> = params$.pipe(
    // skip the initial undefined params
    skip(1),
    tap(() => loading$.next(true)),
    map((params): AjaxRequest => {
      const config = requestBuilder.buildRequest(operationID, params);
      return requestConfigToAjaxRequest(config);
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ body: response, error: undefined })),
    tap(() => loading$.next(false)),
    catchError((error) => {
      // todo need better log message
      // console.debug('error: ', error);
      return of({ error, body: undefined });
    }),
    share(),
    startWith({ body: undefined, error: undefined }),
  );

  const streamActions = {
    next: (params?: RequestParams): void => {
      params$.next(params);
    },
    refresh: () => {
      params$.next(params$.getValue());
    },
    _complete: () => {
      params$.complete();
    },
  };

  const result$: APIResult$ = combineLatest(
    { params: params$, res: response$, loading: loading$ },
  ).pipe(
    map(({ loading, res, params }) => ({ params, body: res.body, error: res.error, loading })),
  );

  const emit$: APIResult$ = loading$.pipe(
    pairwise(),
    map((pair) => pair[0] !== pair[1]),
    filter((shouldEmit) => shouldEmit),
    withLatestFrom(result$),
    map(([, result]) => result),
  );

  return [emit$, streamActions];
}

const dummyResult = { body: null, loading: false, error: undefined, params: undefined };
const dummyStream$ = new BehaviorSubject<APIResult>(dummyResult);
const dummySendRequest: StreamActions = {
  // todo refactor this
  next: (params?: RequestParams): void => {
    console.log(params);
  },
  refresh: () => {
    console.log('refresh called');
  },
  _complete: () => {
    console.log('completed called');
  },
};
dummySendRequest.refresh = noop;
dummySendRequest._complete = noop;

export default class APIStream {
  requestBuilder: RequestBuilder;
  // map of streamID and operationID
  streamIDMap: Record<string, string>;
  streamCache: Record<string, [APIResult$, StreamActions]> = {};

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.requestBuilder = new RequestBuilder(apiDoc);
    this.streamIDMap = streamIDMap;
  }

  getValue<T>(streamID: string, convertor: ResultConvertor<T>): Observable<T> {
    const [apiStream$] = this.getStream(streamID);

    return apiStream$.pipe(map(convertor));
  }

  getAction(streamID: string, convertor?: ActionParamsConvertor): (...args: any[]) => void {
    const [, { next }] = this.getStream(streamID);

    return (...args: any[]) => {
      next(convertor?.(...args));
    };
  }

  getStream(streamID: string): [APIResult$, StreamActions] {
    if (!this.streamIDMap[streamID]) {
      // todo log error message
      return [dummyStream$, dummySendRequest];
    }

    const key = `${streamID}:${this.streamIDMap[streamID]}`;
    if (!this.streamCache[key]) {
      const [apiResult$, setParams] = createAPIResult$(this.streamIDMap[streamID], this.requestBuilder);
      this.streamCache[key] = [apiResult$, setParams];
    }

    return this.streamCache[key];
  }
}
