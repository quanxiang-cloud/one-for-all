import { APIStateWithFetch, APIState } from '../types';
import APIStatesHub from './states-hub-api';

function getAPIStates(statesHubAPI: APIStatesHub): Record<string, APIStateWithFetch> {
  const handler: ProxyHandler<Readonly<Record<string, APIState>>> = {
    get: (target: Readonly<Record<string, APIState>>, p: string): APIStateWithFetch => {
      const apiState = statesHubAPI.getState$(p).getValue();
      return {
        ...apiState,
        fetch: statesHubAPI.getFetch(p),
        refresh: () => statesHubAPI.refresh(p),
      };
    },
  };

  return new Proxy<Record<string, APIStateWithFetch>>({}, handler);
}

export default getAPIStates;
