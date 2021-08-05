import { useObservableState } from 'observable-hooks';

import getQueryResultStream, { SetParams, UseQueryResult } from './api-stream';

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
