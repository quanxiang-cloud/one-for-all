import { noop } from 'lodash';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import { RequestParams } from '@ofa/request-builder/src/types';

import getResponse$ from './response';
import { APIState } from '../types';
import { RequestConfig } from 'packages/request-builder/src';

export type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  // __complete: () => void;
};

export const initialState = { data: undefined, error: undefined, params: undefined, loading: false };

type State = Omit<APIState, 'params'>;
// operationID: string, requestBuilder: RequestBuilder
function getState$(request$: Observable<RequestConfig>): Observable<State> {
  const state$ = new BehaviorSubject<State>(initialState);
  // const params$ = new Subject<RequestParams>();
  // const request$ = params$.pipe(
  //   map((params) => requestBuilder.buildRequest(operationID, params)),
  // );
  const response$ = getResponse$(request$);

  response$.pipe(
    map((resp) => ({ ...resp, loading: false })),
  ).subscribe(state$);

  request$.pipe(
    filter(() => state$.getValue().loading === false),
    map(() => ({ ...state$.getValue(), loading: true })),
  ).subscribe(state$);

  return state$;
}

const dummyResult = { body: null, loading: false, error: undefined, params: undefined };
export const dummyStream$: Observable<APIState> = new BehaviorSubject(dummyResult);
export const dummySendRequest: StreamActions = {
  // todo refactor this
  next: noop,
  refresh: noop,
  // __complete: noop,
};

export default getState$;
