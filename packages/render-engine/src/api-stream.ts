import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, catchError, share, skip } from 'rxjs/operators';

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

const streamCache: Record<string, [APIResult$, SendRequest]> = {};

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
    // skip zhe initial undefined params
    skip(1),
    tap(() => (loading = true)),
    map((params): AjaxRequest => {
      const config = requestBuilder.fillRequest(apiID, params);
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

function getAPIResult$(streamID: string, apiID: string, requestBuilder: RequestBuilder): [APIResult$, SendRequest] {
  const key = `${streamID}-${apiID}`;

  if (!streamCache[key]) {
    const [apiResult$, setParams] = createAPIResult$(apiID, requestBuilder);
    streamCache[key] = [apiResult$, setParams];
  }

  return streamCache[key];
}

export default getAPIResult$;
