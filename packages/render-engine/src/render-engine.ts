import React from 'react';
import ReactDOM from 'react-dom';
import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import deserializeSchema from './deserialize-schema';
import APIStatesHub from './ctx/states-hub-api';
import SharedStateHub from './ctx/states-hub-shared';
import getAPIStates from './ctx/api-states';
import getSharedStates from './ctx/shared-states';
import type { CTX, Schema } from './types';
import NodeRender from './node-render';

type Props = {
  apiSpecAdapter: APISpecAdapter;
  schema: Schema;
}

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;

  constructor({ schema, apiSpecAdapter }: Props) {
    this.schema = schema;
    const statesHubAPI = new APIStatesHub(apiSpecAdapter, schema.apiStateSpec);
    const statesHubShared = new SharedStateHub(schema.sharedStatesSpec);
    this.ctx = {
      statesHubAPI: statesHubAPI,
      statesHubShared: statesHubShared,

      apiStates: getAPIStates(statesHubAPI),
      states: getSharedStates(statesHubShared),
    };

    statesHubAPI.initContext(this.ctx);
    statesHubShared.initContext(this.ctx);
  }

  render(renderRoot: Element): void {
    const instantiatedNode = deserializeSchema({ node: this.schema.node, ctx: this.ctx });
    if (!instantiatedNode) {
      // TODO: paint error
      // return { ctx };
      return;
    }

    ReactDOM.render(React.createElement(NodeRender, { node: instantiatedNode, ctx: this.ctx }), renderRoot);
  }
}
