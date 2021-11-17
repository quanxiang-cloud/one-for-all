import { Builder } from '@ofa/request-builder';

import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { CTX, Schema } from './types';
import APIStateHub from './ctx/api-state-hub';
import SharedStatesHub from './ctx/shared-states-hub';
import NodeStateHub from './ctx/node-state-hub';

export * from './types';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  builder: Builder;
}

function Render({ schema, rootEle, builder }: RenderSchemaParams): CTX {
  const apiStateHub = new APIStateHub(builder, schema.apiStateSpec);
  const sharedStatesHub = new SharedStatesHub(schema.sharedStatesSpec);

  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: sharedStatesHub,
    nodeStates: new NodeStateHub(),
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
