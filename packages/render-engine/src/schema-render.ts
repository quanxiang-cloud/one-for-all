import React from 'react';
import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import type {
  CTX,
  Schema,
} from './types';
import NodeRender from './node-render';
import APIStatesHub from './ctx/states-hub-api';
import SharedStateHub from './ctx/states-hub-shared';
import getAPIStates from './ctx/api-states';
import getSharedStates from './ctx/shared-states';
import deserializeSchema from './deserialize-schema';

type Props = {
  schema: Schema;
  apiSpecAdapter: APISpecAdapter;
}

// todo forward ref
function SchemaRender({ schema, apiSpecAdapter }: Props): React.ReactElement | null {
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

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default SchemaRender;
