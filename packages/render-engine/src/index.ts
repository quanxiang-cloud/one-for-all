import { OpenAPIV3 } from 'openapi-types';

import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { CTX, Schema } from './types';
import APIStateHub from './ctx/api-state-hub';
import SharedStatesHub from './ctx/shared-states-hub';
import NodeInternalStates from './ctx/node-internal-states';

export * from './types';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function Render({ schema, rootEle, apiDoc }: RenderSchemaParams): CTX {
  const apiStateHub = new APIStateHub(apiDoc, schema.apiStateSpec);
  const sharedStatesHub = new SharedStatesHub(schema.sharedStatesSpec);

  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: sharedStatesHub,
    nodeInternalStates: new NodeInternalStates(),
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
