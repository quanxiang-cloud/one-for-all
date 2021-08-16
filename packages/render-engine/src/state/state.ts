import { BehaviorSubject, filter, map, Observable } from 'rxjs';

import getResponse$ from './response';
import { APIState } from '../types';
import { RequestConfig } from 'packages/request-builder/src';

export const initialState: Omit<APIState, 'params'> = { data: undefined, error: undefined, loading: false };

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

export default getState$;
