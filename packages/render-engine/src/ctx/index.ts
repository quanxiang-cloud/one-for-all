import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { APIStatesSpec, SharedStatesSpec as _SharedStatesSpec } from '@one-for-all/schema-spec';

import getAPIStates from './api-states';
import deserialize from '../deserialize';
import StatesHubAPI from './states-hub-api';
import getSharedStates from './shared-states';
import StatesHubShared from './states-hub-shared';
import type { CTX, Plugins, SharedStatesSpec } from '../types';
import initializeLazyStates from './initialize-lazy-shared-states';
import { To } from 'history';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  parentCTX?: CTX;
  plugins?: Plugins;
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: _SharedStatesSpec;
  urlPush?: (to: To, state: any) => void;
}

async function initCTX({ parentCTX, plugins, apiStateSpec, sharedStatesSpec, urlPush }: Params): Promise<CTX> {
  const { apiSpecAdapter, repository, refLoader, componentLoader } = plugins || {};

  const statesHubAPI = new StatesHubAPI(
    {
      // TODO: throw error instead of tolerating it
      apiSpecAdapter: apiSpecAdapter || dummyAPISpecAdapter,
      apiStateSpec: apiStateSpec || {},
    },
    parentCTX?.statesHubAPI,
  );

  const instantiateSpec = deserialize(sharedStatesSpec, null) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(
    instantiateSpec || {},
    apiStateSpec || {},
    apiSpecAdapter,
  );
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const ctx: CTX =  {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),

    urlPush,
    repository: repository || parentCTX?.repository,
    refLoader: refLoader || parentCTX?.refLoader,
    componentLoader: componentLoader || parentCTX?.componentLoader
  };

  return ctx;
}

export default initCTX;
