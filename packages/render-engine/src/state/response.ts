import { noop } from 'lodash';
import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, Observable } from 'rxjs';
import { map, switchMap, catchError, share } from 'rxjs/operators';

import { RequestConfig } from '@ofa/request-builder/src';

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

function getRawResponse(ajaxRequest: AjaxRequest): Response$ {
  return ajax(ajaxRequest).pipe(
    map(({ response }) => ({ data: response, error: undefined })),
    catchError((error) => {
      // todo need better log message
      // console.debug('error', error);
      return of({ error: error, data: undefined });
    }),
  );
}

function getResponse$(request$: Observable<RequestConfig>): Response$ {
  const response$: Response$ = request$.pipe(
    map(requestConfigToAjaxRequest),
    switchMap(getRawResponse),
    share(),
  );

  // keep at least one subscriber
  // todo remove this?
  response$.subscribe(noop);

  return response$;
}

export default getResponse$;
