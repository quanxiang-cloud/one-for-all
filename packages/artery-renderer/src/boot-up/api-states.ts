import { FetchParams } from '@one-for-all/api-spec-adapter';
import { APIFetchCallback } from '..';
import { APIStateWithFetch, APIState, StatesHubAPI, RawFetchOption } from '../types';

function getAPIStates(statesHubAPI: StatesHubAPI): Readonly<Record<string, APIStateWithFetch>> {
  const handler: ProxyHandler<Readonly<Record<string, APIState>>> = {
    get: (target: Readonly<Record<string, APIState>>, p: string): APIStateWithFetch => {
      const apiState = statesHubAPI.getState$(p).getValue();

      return {
        ...apiState,
        refresh: () => statesHubAPI.refresh(p),
        fetch: (fetchParams: FetchParams, callback?: APIFetchCallback): void => {
          statesHubAPI.fetch(p, { params: fetchParams, callback });
        },
        rawFetch: (rawFetchOption: RawFetchOption, callback?: APIFetchCallback | undefined): void => {
          statesHubAPI.rawFetch(p, rawFetchOption);
        },
      };
    },
  };

  return new Proxy<Readonly<Record<string, APIStateWithFetch>>>({}, handler);
}

export default getAPIStates;
