import { useObservableState } from 'observable-hooks';
import RequestBuilder from '@ofa/request-builder';

import getQueryResultStream, { SetParams, UseQueryResult } from './api-stream';

const defaultResult: UseQueryResult = {
  loading: true,
  params: {},
  body: null,
  error: undefined,
};

function useQuery(apiID: string, builder: RequestBuilder): [UseQueryResult, SetParams] {
  const [queryStateObs$, setParams] = getQueryResultStream(apiID, builder);

  return [useObservableState(queryStateObs$) || defaultResult, setParams];
}

export default useQuery;
