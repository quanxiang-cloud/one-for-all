import { noop } from 'lodash';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, BehaviorSubject, Observable } from 'rxjs';
import {
  tap, map, switchMap, catchError, share, startWith, pairwise, filter, withLatestFrom, skip,
} from 'rxjs/operators';

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
  __complete: () => void;
};

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
    __complete: () => {
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
export const dummyStream$ = new BehaviorSubject<APIResult>(dummyResult);
export const dummySendRequest: StreamActions = {
  // todo refactor this
  next: noop,
  refresh: noop,
  __complete: noop,
};

export default createAPIResult$;
