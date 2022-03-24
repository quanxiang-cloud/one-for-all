import { merge, Subject } from 'rxjs';
import { AjaxConfig } from 'rxjs/ajax';
import { map, filter, share, skip, delay } from 'rxjs/operators';
import type { APISpecAdapter, FetchParams } from '@one-for-all/api-spec-adapter';

import type { FetchOption, APIState$WithActions } from '../types';
import getResponseState$ from './http/response';

function initAPIState(apiID: string, apiSpecAdapter: APISpecAdapter): APIState$WithActions {
  const rawParams$ = new Subject<AjaxConfig>();
  const params$ = new Subject<FetchParams | undefined>();
  const request$ = params$.pipe(
    // it is adapter's responsibility to handle build error
    // if a error occurred, build should return undefined
    map((params) => apiSpecAdapter.build(apiID, params)),
    filter(Boolean),
    share(),
  );

  let _latestFetchOption: FetchOption | undefined = undefined;
  const apiState$ = getResponseState$(merge(request$, rawParams$), apiSpecAdapter.responseAdapter);

  // execute fetch callback after new `result` emitted from apiState$
  apiState$
    .pipe(
      skip(1),
      filter(({ loading }) => !loading),
      // because this subscription is happened before than view's,
      // so delay `callback` execution to next frame.
      delay(10),
    )
    .subscribe((state) => {
      _latestFetchOption?.callback?.(state);
    });

  return {
    state$: apiState$,
    fetch: (fetchOption: FetchOption) => {
      _latestFetchOption = fetchOption;

      params$.next(fetchOption.params);
    },
    rawFetch: ({ callback, ...ajaxConfig }) => {
      // todo fix this
      _latestFetchOption = { callback };

      rawParams$.next(ajaxConfig);
    },
    refresh: () => {
      if (!_latestFetchOption) {
        return;
      }
      // override onSuccess and onError to undefined
      _latestFetchOption = { params: _latestFetchOption.params };
      params$.next(_latestFetchOption.params);
    },
  };
}

export default initAPIState;
