import { noop } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, pairwise, filter, withLatestFrom, startWith,
} from 'rxjs/operators';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import createResponse$ from './api-response';
import { APIResult, APIResult$ } from './types';

// API Stream State Table
/*
    |     | loading |   body    |   error   |
    | --- | :-----: | :-------: | :-------: |
    | 1   |  false  | undefined | undefined |
    | 2   |  true   | undefined | undefined |
┌──►| 3   |  false  |    {}     | undefined |◄────┐
└───| 4   |  true   |    {}     | undefined |     │
    | 5   |  false  | undefined |    xxx    |     │
    | 6   |  true   | undefined |    xxx    |─────┘
*/

export type StreamActions = {
  next: (params?: RequestParams) => void;
  refresh: () => void;
  __complete: () => void;
};

export const initialState = { data: undefined, error: undefined, params: undefined, loading: false };

function createAPIResult$(operationID: string, requestBuilder: RequestBuilder): [APIResult$, StreamActions] {
  const loading$ = new Subject<boolean>();

  const [response$, nextParams] = createResponse$({
    requestBuilder,
    operationID,
    beforeStart: () => loading$.next(true),
    afterSolved: () => loading$.next(false),
  });

  const source$ = new BehaviorSubject<APIResult>(initialState);

  const emit$: APIResult$ = loading$.pipe(
    pairwise(),
    filter((pair) => pair[0] !== pair[1]),
    map((pair) => pair[1]),
    withLatestFrom(response$),
    map(([loading, response]) => ({ loading, ...response })),
    startWith({ data: undefined, error: undefined, params: undefined, loading: false }),
  );

  emit$.subscribe((result) => source$.next(result));

  const streamActions = {
    next: nextParams,
    refresh: () => {
      // params$.next(latestParams);
    },
    __complete: () => {
      // params$.complete();
    },
  };

  return [source$, streamActions];
}

const dummyResult = { body: null, loading: false, error: undefined, params: undefined };
export const dummyStream$: APIResult$ = new BehaviorSubject(dummyResult);
export const dummySendRequest: StreamActions = {
  // todo refactor this
  next: noop,
  refresh: noop,
  __complete: noop,
};

export default createAPIResult$;
