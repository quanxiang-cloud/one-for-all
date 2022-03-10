import { To } from 'history';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type { APIStatesSpec, SharedStatesSpec as _SharedStatesSpec } from '@one-for-all/schema-spec';

import getAPIStates from './api-states';
import deserialize from '../deserialize';
import StatesHubAPI from './states-hub-api';
import getSharedStates from './shared-states';
import StatesHubShared from './states-hub-shared';
import type { CTX, Plugins, SharedStatesSpec } from '../types';
import initializeLazyStates from './initialize-lazy-shared-states';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  parentCTX?: CTX;
  plugins?: Plugins;
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: _SharedStatesSpec;
  goTo?: (to: To, state: any) => void;
  goBack?: () => void,
}

async function initCTX({ parentCTX, plugins, apiStateSpec, sharedStatesSpec, goTo, goBack }: Params): Promise<CTX> {
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

    goTo,
    goBack,
    repository: repository || parentCTX?.repository,
    refLoader: refLoader || parentCTX?.refLoader,
    componentLoader: componentLoader || parentCTX?.componentLoader
  };

  return ctx;
}

export default initCTX;
