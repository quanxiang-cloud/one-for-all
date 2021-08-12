import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap, catchError, share, skip } from 'rxjs/operators';
import { noop } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig } from '@ofa/request-builder/src';
import { RequestParams } from '@ofa/request-builder/src/types';

import { APIResult, APIResult$ } from './types';

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

function createAPIResult$(apiID: string, requestBuilder: RequestBuilder): [APIResult$, StreamActions] {
  let loading = false;

  const params$ = new BehaviorSubject<RequestParams | undefined>(undefined);
  const response$: Observable<Pick<APIResult, 'body' | 'error'>> = params$.pipe(
    // skip the initial undefined params
    skip(1),
    tap(() => (loading = true)),
    map((params): AjaxRequest => {
      const config = requestBuilder.buildRequest(apiID, params);
      return requestConfigToAjaxRequest(config);
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ body: response, error: undefined })),
    catchError((error) => {
      // todo need better log message
      // console.debug('error: ', error);
      return of({ error, body: undefined });
    }),
    tap(() => loading = false),
    share(),
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

  const result$: APIResult$ = combineLatest([params$, response$]).pipe(
    map(([params, { body, error }]) => ({ params, body, error, loading })),
  );

  return [result$, streamActions];
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
  // map of streamID and apiID
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
