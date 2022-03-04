import StatesHubAPI from './states-hub-api';
import StatesHubShared from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, Plugins, SharedStatesSpec } from '../types';
import type { APIStatesSpec, SharedStatesSpec as _SharedStatesSpec } from '@one-for-all/schema-spec';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import deserialize from '../deserialize';
import initializeLazyStates from './initialize-lazy-shared-states';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: _SharedStatesSpec;
  parentCTX?: CTX;
  plugins?: Plugins;
}

async function initCTX({ apiStateSpec, sharedStatesSpec, parentCTX, plugins }: Params): Promise<CTX> {
  const { apiSpecAdapter, repository, refLoader } = plugins || {};

  const statesHubAPI = new StatesHubAPI(
    {
      // TODO: throw error instead of tolerating it
      apiSpecAdapter: apiSpecAdapter || dummyAPISpecAdapter,
      apiStateSpec: apiStateSpec || {},
    },
    parentCTX?.statesHubAPI,
  );

  const instantiateSpec = deserialize(sharedStatesSpec, null) as SharedStatesSpec | null;
  const initializedState = await initializeLazyStates(instantiateSpec || {}, apiStateSpec || {}, apiSpecAdapter);
  const statesHubShared = new StatesHubShared(initializedState, parentCTX?.statesHubShared);

  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),

    repository: repository || parentCTX?.repository,
    refLoader: refLoader || parentCTX?.refLoader,
  };

  return ctx;
}

export default initCTX;
