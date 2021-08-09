import { useObservableState } from 'observable-hooks';
import RequestBuilder from '@ofa/request-builder';

import getAPIResult$, { SendRequest, APIResult } from './api-stream';

const defaultResult: APIResult = {
  loading: true,
  params: {},
  body: null,
  error: undefined,
};

type Convertor<T extends Record<string, unknown>> = (response: any) => T;

function getAPIAndBuilderByStreamID(streamID: string): [string, RequestBuilder] {
  // todo implement this
  return ['someAPIId', new RequestBuilder({} as any)];
}

function useAPI<T extends Record<string, unknown>>(
  streamID: string,
  convertor: Convertor<T>,
): [T, SendRequest] {
  const [apiID, builder] = getAPIAndBuilderByStreamID(streamID);
  const [queryStateObs$, sendRequest] = getAPIResult$(streamID, apiID, builder);

  const result = convertor(useObservableState(queryStateObs$) || defaultResult);

  return [result, sendRequest];
}

export default useAPI;
