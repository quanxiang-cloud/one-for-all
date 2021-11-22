import { catchError, map, Observable, of, share, switchMap } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';

import type { APIState } from '../../types';

type Response = Omit<APIState, 'loading'>;
type Response$ = Observable<Response>;

// todo support retry and timeout
function sendRequest(ajaxRequest: AjaxConfig): Response$ {
  return ajax(ajaxRequest).pipe(
    map<AjaxResponse<any>, Response>(({ response }) => ({ result: response, error: undefined })),
    catchError((error) => {
      return of({ error: error, data: undefined });
    }),
  );
}

export default function http(request$: Observable<AjaxConfig>): Response$ {
  const response$: Response$ = request$.pipe(
    switchMap(sendRequest),
    share(),
  );

  // // keep at least one subscriber to ensure response$ hot
  // // TODO: give more explanation
  // response$.subscribe(noop);

  return response$;
}
