import { noop } from 'lodash';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError, share, filter } from 'rxjs/operators';

import { RequestConfig } from '@ofa/spec-interpreter/src/types';

import { APIState } from './types';

function requestConfigToAjaxRequest(config: RequestConfig): AjaxRequest {
  let url = `http://localhost:8080${config.path}`;
  const query = Object.entries(config.query || {}).map(([key, value]) => `${key}=${value}`).join('&');
  if (query) {
    url = `${url}?${query}`;
  }

  return {
    method: config.method,
    // url: config.path,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    async: true,
    timeout: 1000,
    crossDomain: false,
    withCredentials: false,
    responseType: 'json',
    body: config.body,
  };
}

function sendRequest(ajaxRequest: AjaxRequest): Observable<{ data: unknown; error: any; }> {
  return ajax(ajaxRequest).pipe(
    map(({ response }) => ({ data: response, error: undefined })),
    catchError((error) => {
      // TODO:
      // - need better log message
      // - return an readable error object
      return of({ error: error, data: undefined });
    }),
  );
}

type Response$ = Observable<{ data?: any; error?: any; }>

export function http(request$: Observable<RequestConfig>): Response$ {
  const response$: Response$ = request$.pipe(
    map(requestConfigToAjaxRequest),
    switchMap(sendRequest),
    share(),
  );

  // keep at least one subscriber to ensure response$ hot
  // TODO: give more explanation
  response$.subscribe(noop);

  return response$;
}

export const initialState: Omit<APIState, 'params'> = { data: undefined, error: undefined, loading: false };

// API State Table
/*
    |     | loading |   data    |   error   |
    | --- | :-----: | :-------: | :-------: |
    | 1   |  false  | undefined | undefined |
    | 2   |  true   | undefined | undefined |
┌──►| 3   |  false  |    {}     | undefined |◄────┐
└───| 4   |  true   |    {}     | undefined |     │
    | 5   |  false  | undefined |    xxx    |     │
    | 6   |  true   | undefined |    xxx    |─────┘
*/
type State = Omit<APIState, 'params'>;

export default function getResponseState$(request$: Observable<RequestConfig>): Observable<State> {
  const state$ = new BehaviorSubject<State>(initialState);
  const response$ = http(request$);

  response$.pipe(
    map((resp) => ({ ...resp, loading: false })),
  ).subscribe(state$);

  request$.pipe(
    filter(() => state$.getValue().loading === false),
    map(() => ({ ...state$.getValue(), loading: true })),
  ).subscribe(state$);

  return state$;
}
