import { useObservableState } from 'observable-hooks';
import RequestBuilder from '@ofa/request-builder';

import getAPIResult$, { SendRequest, APIResult } from './api-stream';

const defaultResult: APIResult = {
  loading: true,
  params: {},
  body: null,
  error: undefined,
};

function useQuery(streamID: string, apiID: string, builder: RequestBuilder): [APIResult, SendRequest] {
  const [queryStateObs$, sendRequest] = getAPIResult$(streamID, apiID, builder);

  return [useObservableState(queryStateObs$) || defaultResult, sendRequest];
}

export default useQuery;
