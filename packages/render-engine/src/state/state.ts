import { noop } from 'lodash';
import { BehaviorSubject, filter, map, Observable, Subject, withLatestFrom } from 'rxjs';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import getResponse$ from './response';
import { APIState } from '../types';

export type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  __complete: () => void;
};

export const initialState = { data: undefined, error: undefined, params: undefined, loading: false };

function getState$(operationID: string, requestBuilder: RequestBuilder): [Observable<APIState>, StreamActions] {
  const state$ = new BehaviorSubject<APIState>(initialState);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest(operationID, params)),
  );
  const response$ = getResponse$(request$);

  response$.pipe(
    withLatestFrom(params$),
    map(([resp, params]) => ({ ...resp, params, loading: false })),
  ).subscribe((result) => state$.next(result));

  params$.pipe(
    filter(() => state$.getValue().loading === false),
  ).subscribe(() => {
    state$.next({ ...state$.getValue(), loading: true });
  });

  const streamActions = {
    next: (params: RequestParams) => {
      params$.next(params);
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
export const dummyStream$: Observable<APIState> = new BehaviorSubject(dummyResult);
export const dummySendRequest: StreamActions = {
  // todo refactor this
  next: noop,
  refresh: noop,
  __complete: noop,
};

export default getState$;
