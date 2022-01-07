import StatesHubAPI from './states-hub-api';
import StatesHubShared from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, InitProps } from '../types';

function initCTX({ schema, apiSpecAdapter, repository, refLoader }: InitProps, parentCTX?: CTX): CTX {
  const statesHubAPI = new StatesHubAPI(
    { apiSpecAdapter, apiStateSpec: schema.apiStateSpec },
    parentCTX?.statesHubAPI,
  );
  const statesHubShared = new StatesHubShared(schema.sharedStatesSpec, parentCTX?.statesHubShared);
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
