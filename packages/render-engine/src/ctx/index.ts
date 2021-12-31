import APIStatesHub from './states-hub-api';
import SharedStateHub from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, InitProps } from '../types';

function initCTX({ schema, apiSpecAdapter, repository }: InitProps): CTX {
  const statesHubAPI = new APIStatesHub(apiSpecAdapter, schema.apiStateSpec);
  const statesHubShared = new SharedStateHub(schema.sharedStatesSpec);
  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),

    repository,
  };

  return ctx;
}

export default initCTX;
