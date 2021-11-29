import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import APIStatesHub from './states-hub-api';
import SharedStateHub from './states-hub-shared';
import getAPIStates from './api-states';
import getSharedStates from './shared-states';
import type { CTX, Schema } from '../types';

function initCTX(schema: Schema, apiSpecAdapter: APISpecAdapter): CTX {
  const statesHubAPI = new APIStatesHub(apiSpecAdapter, schema.apiStateSpec);
  const statesHubShared = new SharedStateHub(schema.sharedStatesSpec);
  const ctx: CTX = {
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),
  };

  statesHubAPI.initContext(ctx);
  statesHubShared.initContext(ctx);

  return ctx;
}

export default initCTX;
