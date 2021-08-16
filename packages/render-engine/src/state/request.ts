import { noop } from 'lodash';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, Observable } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, share } from 'rxjs/operators';

import RequestBuilder from '@ofa/request-builder';
import { RequestConfig } from '@ofa/request-builder/src';
import { RequestParams } from '@ofa/request-builder/src/types';

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
  params$: Observable<RequestParams>;
}

type Response$ = Observable<{ params: RequestParams; data?: any; error?: any; }>

function getResponse$({ requestBuilder, operationID, params$ }: Props): Response$ {
  const response$: Observable<{ data?: any; error?: any; params: RequestParams; }> = params$.pipe(
    map((params): AjaxRequest => {
      const config = requestBuilder.buildRequest(operationID, params);
      return requestConfigToAjaxRequest(config);
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ data: response, error: undefined })),
    catchError((error) => {
      // todo need better log message
      // console.debug('error', error);
      return of({ error: error, data: undefined });
    }),
    withLatestFrom(params$),
    map(([{ data, error }, params]) => ({ data, error, params })),
    // keep response$ hot
    share(),
  );

  // keep at least one subscriber
  response$.subscribe(noop);

  return response$;
}

export default getResponse$;
