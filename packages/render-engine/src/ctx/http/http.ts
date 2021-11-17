import { catchError, map, Observable, of, share, switchMap } from 'rxjs';
import { ajax, AjaxConfig } from 'rxjs/ajax';

type Response$ = Observable<{ data: any; error: any; }>;

function sendRequest(ajaxRequest: AjaxConfig): Observable<{ data: unknown; error: any; }> {
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
