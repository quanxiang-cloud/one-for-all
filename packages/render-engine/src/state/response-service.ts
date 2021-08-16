import { noop } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

import getResponse$ from './request';
import { APIResult, APIResult$ } from '../types';

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

function responseState$(operationID: string, requestBuilder: RequestBuilder): [APIResult$, StreamActions] {
  const source$ = new BehaviorSubject<APIResult>(initialState);
  function onLoading(): void {
    source$.next({ ...source$.getValue(), loading: true });
  }

  function onLoad(result: Omit<APIResult, 'loading'>): void {
    source$.next({ ...result, loading: false });
  }

  const loading$ = new BehaviorSubject<boolean>(false);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID,
  });

  response$.subscribe(onLoad);

  response$.subscribe(() => loading$.next(false));

  const streamActions = {
    next: (params: RequestParams) => {
      nextParams(params);
      if (!source$.getValue().loading) {
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

export default responseState$;
