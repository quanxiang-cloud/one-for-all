import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, catchError, share } from 'rxjs/operators';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig } from 'packages/request-builder/src';

export type RequestParams = Record<string, unknown>;
export type SetParams = {
  (params: RequestParams): void,
  refresh: () => void,
};
export type UseQueryResult = {
  params: RequestParams;
  body: any;
  loading: boolean;
  error: Error | undefined;
};
export type UseQueryResult$ = Observable<UseQueryResult>;

export const queryResultObsCache: Record<string, [UseQueryResult$, SetParams]> = {};

function convertRequestConfigToAjaxRequest(config: RequestConfig): AjaxRequest {
  return {
    method: config.method,
    url: config.path,
    headers: {
      'Content-Type': 'application/json'
    },
    async: true,
    timeout: 1000,
    crossDomain: false,
    withCredentials: false,
    responseType: 'json',
  };
}

function createQueryResultStream(apiID: string, requestBuilder: RequestBuilder): [UseQueryResult$, SetParams] {
  let loading = false;

  // todo is it appropriate to initialize request$ with an empty param?
  const params$: BehaviorSubject<RequestParams> = new BehaviorSubject<RequestParams>({});
  const response$ = params$.pipe(
    tap(() => (loading = true)),
    map((params): AjaxRequest => {
      const config = requestBuilder.fillRequest(apiID, params);

      return convertRequestConfigToAjaxRequest(config);
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ body: response, error: undefined })),
    // catch network errors
    catchError((error) => {
      console.log('error: ', error);
      return of({ error, body: undefined });
    }),
    tap(() => (loading = false)),
    share(),
  );

  function setParams(params: RequestParams) {
    params$.next(params);
  }

  setParams.refresh = () => {
    setParams(params$.getValue());
  };

  const result$: UseQueryResult$ = combineLatest([params$, response$]).pipe(
    map(([params, { body, error }]) => {
      return { params, body, error, loading };
    }),
  );

  return [result$, setParams];
}

export default function getQueryResultStream(apiID: string, requestBuilder: RequestBuilder): [UseQueryResult$, SetParams] {
  if (!queryResultObsCache[apiID]) {
    const [queryResult$, setParams] = createQueryResultStream(apiID, requestBuilder);
    queryResultObsCache[apiID] = [queryResult$, setParams];
  }

  return queryResultObsCache[apiID];
}
