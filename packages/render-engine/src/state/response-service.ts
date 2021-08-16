import { noop } from 'lodash';
import { BehaviorSubject, map, Subject, withLatestFrom } from 'rxjs';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import getResponse$ from './response';
import { APIResult, APIResult$ } from '../types';

export type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  __complete: () => void;
};

export const initialState = { data: undefined, error: undefined, params: undefined, loading: false };

function responseState$(operationID: string, requestBuilder: RequestBuilder): [APIResult$, StreamActions] {
  const state$ = new BehaviorSubject<APIResult>(initialState);
  const source$ = new Subject<Omit<APIResult, 'params'>>();

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest(operationID, params)),
  );
  // todo refactor this
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }
  function onLoading(): void {
    state$.next({ ...state$.getValue(), loading: true });
  }

  function onLoad(result: Omit<APIResult, 'loading' | 'params'>): void {
    source$.next({ ...result, loading: false });
  }

  const response$ = getResponse$(request$);
  response$.subscribe(onLoad);

  source$.pipe(
    withLatestFrom(params$),
    map(([resp, params]) => ({ ...resp, params })),
  ).subscribe((state) => {
    state$.next(state);
  });

  const streamActions = {
    next: (params: RequestParams) => {
      nextParams(params);
      if (!state$.getValue().loading) {
        onLoading();
      }
    },
    refresh: () => {
      // params$.next(latestParams);
    },
    __complete: () => {
      // params$.complete();
    },
  };

  return [state$, streamActions];
}

const dummyResult = { body: null, loading: false, error: undefined, params: undefined };
export const dummyStream$: APIResult$ = new BehaviorSubject(dummyResult);
export const dummySendRequest: StreamActions = {
  // todo refactor this
  next: noop,
  refresh: noop,
  __complete: noop,
};

export default responseState$;
