import { Observable, BehaviorSubject } from 'rxjs';
import { AjaxConfig } from 'rxjs/ajax';
import { map, filter } from 'rxjs/operators';

import type { APIState } from '../../types';

import http from './http';

// API State Table
/*
    |     | loading |   data    |   error   |
    | --- | :-----: | :-------: | :-------: |
    | 1   |  false  | undefined | undefined |
    | 2   |  true   | undefined | undefined |
┌──►| 3   |  false  |    {}     | undefined |◄────┐
└───| 4   |  true   |    {}     | undefined |     │
    | 5   |  false  | undefined |    xxx    |     │
    | 6   |  true   | undefined |    xxx    |─────┘
*/
type ResponseState = Omit<APIState, 'params'>;

export const initialState: ResponseState = { data: undefined, error: undefined, loading: false };

function getResponseState$(request$: Observable<AjaxConfig>): BehaviorSubject<ResponseState> {
  const state$ = new BehaviorSubject<ResponseState>(initialState);
  const response$ = http(request$);

  response$.pipe(
    map(({ data, error }) => ({ data, error, loading: false })),
  ).subscribe(state$);

  request$.pipe(
    filter(() => state$.getValue().loading === false),
    map(() => ({ ...state$.getValue(), loading: true })),
  ).subscribe(state$);

  return state$;
}

export default getResponseState$;
