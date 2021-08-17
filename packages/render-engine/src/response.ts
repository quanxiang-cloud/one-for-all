import { noop } from 'lodash';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError, share, filter } from 'rxjs/operators';

import { RequestConfig } from '@ofa/request-builder/src';

import { APIState } from './types';

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

type Response$ = Observable<{ data?: any; error?: any; }>

export function httpClient(request$: Observable<RequestConfig>): Response$ {
  const response$: Response$ = request$.pipe(
    map(requestConfigToAjaxRequest),
    switchMap((ajaxRequest) => {
      return ajax(ajaxRequest).pipe(
        map(({ response }) => ({ data: response, error: undefined })),
        catchError((error) => {
          // todo need better log message
          // console.debug('error', error);
          return of({ error: error, data: undefined });
        }),
      );
    }),
    share(),
  );

  // keep at least one subscriber
  // todo remove this?
  response$.subscribe(noop);

  return response$;
}

export const initialState: Omit<APIState, 'params'> = { data: undefined, error: undefined, loading: false };

type State = Omit<APIState, 'params'>;
// operationID: string, requestBuilder: RequestBuilder
export default function getState(request$: Observable<RequestConfig>): Observable<State> {
  const state$ = new BehaviorSubject<State>(initialState);
  // const params$ = new Subject<RequestParams>();
  // const request$ = params$.pipe(
  //   map((params) => requestBuilder.buildRequest(operationID, params)),
  // );
  const response$ = httpClient(request$);

  response$.pipe(
    map((resp) => ({ ...resp, loading: false })),
  ).subscribe(state$);

  request$.pipe(
    filter(() => state$.getValue().loading === false),
    map(() => ({ ...state$.getValue(), loading: true })),
  ).subscribe(state$);

  return state$;
}
