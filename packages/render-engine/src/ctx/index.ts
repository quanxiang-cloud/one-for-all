import StatesHubAPI from './states-hub-api';
import StatesHubShared from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, Plugins } from '../types';
import { APIStatesSpec, SharedStatesSpec } from '@one-for-all/schema-spec';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';

const dummyAPISpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

interface Params {
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: SharedStatesSpec;
  parentCTX?: CTX;
  plugins?: Plugins;
}

function initCTX({ apiStateSpec, sharedStatesSpec, parentCTX, plugins }: Params): CTX {
  const { apiSpecAdapter, repository, refLoader } = plugins || {};
  const statesHubAPI = new StatesHubAPI(
    { apiSpecAdapter: apiSpecAdapter || dummyAPISpecAdapter, apiStateSpec: apiStateSpec || {} },
    parentCTX?.statesHubAPI,
  );
  const statesHubShared = new StatesHubShared(sharedStatesSpec || {}, parentCTX?.statesHubShared);
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
