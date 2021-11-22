import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import APIStatesHub from './ctx/states-hub-api';
import SharedStateHub from './ctx/states-hub-shared';
import getAPIStates from './ctx/api-states';
import getSharedStates from './ctx/shared-states';
import type { CTX, Schema } from './types';

export * from './types';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiSpecAdapter: APISpecAdapter;
}

function Render({ schema, rootEle, apiSpecAdapter }: RenderSchemaParams): CTX {
  const statesHubAPI = new APIStatesHub(apiSpecAdapter, schema.apiStateSpec);
  const statesHubShared = new SharedStateHub(schema.sharedStatesSpec);

  const ctx: CTX = {
    // todo remove statesHubAPI and statesHubShared
    statesHubAPI: statesHubAPI,
    statesHubShared: statesHubShared,

    apiStates: getAPIStates(statesHubAPI),
    states: getSharedStates(statesHubShared),
  };

  statesHubAPI.initContext(ctx);
  statesHubShared.initContext(ctx);

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return ctx;
  }

  renderSchema({ node: instantiatedNode, ctx, rootEle });
  return ctx;
}

export default Render;
