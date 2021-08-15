import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, Observable, Subject } from 'rxjs';
import {
  tap, map, switchMap, catchError, withLatestFrom, concatWith, share,
} from 'rxjs/operators';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig } from '@ofa/request-builder/src';
import { RequestParams } from '@ofa/request-builder/src/types';
import { noop } from 'lodash';

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

type Props = {
  requestBuilder: RequestBuilder;
  operationID: string;
  beforeStart?: () => void;
  afterSolved?: () => void;
}

type APIResponse = [
  Observable<{ params: RequestParams; data?: any; error?: string; }>,
  (requestParams?: RequestParams) => void,
]

function getResponse$({ requestBuilder, operationID, beforeStart, afterSolved }: Props): APIResponse {
  const params$ = new Subject<RequestParams>();
  const response$: Observable<{ data?: any; error?: string; params: RequestParams; }> = params$.pipe(
    // skip initial undefined request params
    // skip(1),
    tap(() => beforeStart?.()),
    map((params): AjaxRequest => {
      const config = requestBuilder.buildRequest(operationID, params);
      return requestConfigToAjaxRequest(config);
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ data: response, error: undefined })),
    catchError((error) => {
      // todo need better log message
      console.log('error', error);
      return of({ error: String(error), data: undefined });
    }),
    withLatestFrom(params$),
    map(([{ data, error }, params]) => ({ data, error, params })),
    tap(() => afterSolved?.()),
    share(),
  );

  // at least one Subscriber
  response$.subscribe(noop);

  return [
    of({ data: undefined, error: undefined, params: undefined }).pipe(concatWith(response$)),
    (requestParams?: RequestParams) => {
      params$.next(requestParams);
    },
  ];
}

export default getResponse$;
