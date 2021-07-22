import { ajax, AjaxRequest } from 'rxjs/ajax';
import { of, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, catchError, share } from 'rxjs/operators';
import { useObservableState } from 'observable-hooks';

export type RequestParams = Record<string, unknown>;
export type SetParams = {
  (params: RequestParams): void,
  refresh: () => void,
};
export type UseQueryResult = {
  params: RequestParams;
  body: any;
  loading: boolean;
  error: Error | undefined;
};
export type UseQueryResult$ = Observable<UseQueryResult>;

// todo this is pseudo code
const requestParamsSchemas: Record<string, AjaxRequest> = {
  product: {
    method: 'post',
    url: '/api/products',
    async: true,
    timeout: 100*10000,
    crossDomain: false,
    withCredentials: false,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  },
};

function getRequestParamSchema(apiID: string): AjaxRequest | undefined {
  return requestParamsSchemas[apiID];
}

export const queryResultObsCache: Record<string, [UseQueryResult$, SetParams]> = {};

function createQueryResultStream(apiID: string): [UseQueryResult$, SetParams] {
  let loading = false;

  // todo is it appropriate to initialize request$ with an empty param?
  const params$: BehaviorSubject<RequestParams> = new BehaviorSubject<RequestParams>({});
  const response$ = params$.pipe(
    tap(() => (loading = true)),
    map((params): AjaxRequest => {
      const config = getRequestParamSchema(apiID);
      if (!config) {
        throw new Error(`can find api schema for: ${apiID}`);
      }

      return {
        ...config,
        body: JSON.stringify(params),
      };
    }),
    switchMap((ajaxRequest) => ajax(ajaxRequest)),
    map(({ response }) => ({ body: response, error: undefined })),
    // catch network errors
    catchError((error) => {
      console.log('error: ', error);
      return of({ error, body: undefined });
    }),
    tap(() => (loading = false)),
    share(),
  );

  function setParams(params: RequestParams) {
    params$.next(params);
  }

  setParams.refresh = () => {
    setParams(params$.getValue());
  };

  const result$: UseQueryResult$ = combineLatest([params$, response$]).pipe(
    map(([params, { body, error }]) => {
      return { params, body, error, loading };
    }),
  );

  return [result$, setParams];
}

function getQueryResultStream(apiID: string): [UseQueryResult$, SetParams] {
  if (!queryResultObsCache[apiID]) {
    const [queryResult$, setParams] = createQueryResultStream(apiID);
    queryResultObsCache[apiID] = [queryResult$, setParams];
  }

  return queryResultObsCache[apiID];
}

const defaultResult: UseQueryResult = {
  loading: true,
  params: {},
  body: null,
  error: undefined,
}

function useQuery(apiID: string): [UseQueryResult, SetParams] {
  const [queryStateObs$, setParams] = getQueryResultStream(apiID);

  return [useObservableState(queryStateObs$) || defaultResult, setParams];
}

export default useQuery;
