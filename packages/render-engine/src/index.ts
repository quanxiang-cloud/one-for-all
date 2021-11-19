import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import type { CTX, Schema } from './types';
import APIStateHub from './ctx/api-state-hub';
import SharedStateHub from './ctx/shared-states-hub';

export * from './types';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiSpecAdapter: APISpecAdapter;
}

function Render({ schema, rootEle, apiSpecAdapter }: RenderSchemaParams): CTX {
  const apiStateHub = new APIStateHub(apiSpecAdapter, schema.apiStateSpec);
  const sharedStatesHub = new SharedStateHub(schema.sharedStatesSpec);

  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: sharedStatesHub,
  };

  apiStateHub.initContext(ctx);
  sharedStatesHub.initContext(ctx);

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return ctx;
  }

  renderSchema({ node: instantiatedNode, ctx, rootEle });
  return ctx;
}

export default Render;
