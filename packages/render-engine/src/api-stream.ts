import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, catchError, share, skip } from 'rxjs/operators';
import { noop } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig, RequestParams } from 'packages/request-builder/src';

export type SendRequest = {
  (params?: RequestParams): void;
  refresh: () => void;
  _complete: () => void;
};

export type APIResult = {
  params?: RequestParams;
  body: any;
  loading: boolean;
  error: Error | undefined;
};
type APIResult$ = Observable<APIResult>;

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

function createAPIResult$(apiID: string, requestBuilder: RequestBuilder): [APIResult$, SendRequest] {
  let loading = false;

  const params$ = new BehaviorSubject<RequestParams | undefined>(undefined);
  const response$ = params$.pipe(
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

  function setParams(params?: RequestParams): void {
    params$.next(params);
  }

  setParams.refresh = () => {
    setParams(params$.getValue());
  };

  setParams._complete = () => {
    params$.complete();
  };

  const result$: APIResult$ = combineLatest([params$, response$]).pipe(
    map(([params, { body, error }]) => ({ params, body, error, loading })),
  );

  return [result$, setParams];
}

const dummyStream$ = new BehaviorSubject<APIResult>({ body: null, loading: false, error: undefined });
const dummySendRequest: SendRequest = (params?: RequestParams) => {
  // todo refactor this
  console.log('invalid send request call', params);
};
dummySendRequest.refresh = noop;
dummySendRequest._complete = noop;

export default class APIStream {
  requestBuilder: RequestBuilder;
  // map of streamID and apiID
  streamIDMap: Record<string, string>;
  streamCache: Record<string, [APIResult$, SendRequest]> = {};

  constructor(apiDoc: OpenAPIV3.Document, streamIDMap: Record<string, string>) {
    this.requestBuilder = new RequestBuilder(apiDoc);
    this.streamIDMap = streamIDMap;
  }

  getStream(streamID: string): [APIResult$, SendRequest] {
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
