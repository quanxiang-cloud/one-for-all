import { ResponseAdapter } from '@one-for-all/api-spec-adapter';
import { Observable, BehaviorSubject } from 'rxjs';
import { AjaxConfig } from 'rxjs/ajax';
import { map, filter } from 'rxjs/operators';

import type { APIState } from '../../types';

import http from './http';

// API State Table
/*
    |     | loading |  result   |   error   |
    | --- | :-----: | :-------: | :-------: |
    | 1   |  false  | undefined | undefined |
    | 2   |  true   | undefined | undefined |
┌──►| 3   |  false  |    {}     | undefined |◄────┐
└───| 4   |  true   |    {}     | undefined |     │
    | 5   |  false  | undefined |    xxx    |     │
    | 6   |  true   | undefined |    xxx    |─────┘
*/
export const initialState: APIState = { result: undefined, error: undefined, loading: false };

function getResponseState$(
  request$: Observable<AjaxConfig>,
  responseAdapter?: ResponseAdapter,
): BehaviorSubject<APIState> {
  const state$ = new BehaviorSubject<APIState>(initialState);
  const response$ = http(request$);

  response$
    .pipe(
      map(({ result, error }) => ({ result, error, loading: false })),
      map<APIState, APIState>((apiState) => {
        if (!responseAdapter) {
          return apiState;
        }

        const transformed = responseAdapter({ body: apiState.result, error: apiState.error });

        return { ...transformed, loading: apiState.loading };
      }),
    )
    .subscribe(state$);

  request$
    .pipe(
      filter(() => state$.getValue().loading === false),
      map(() => ({ ...state$.getValue(), loading: true })),
    )
    .subscribe(state$);

  return state$;
}

export default getResponseState$;
