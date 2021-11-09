import { OpenAPIV3 } from 'openapi-types';
import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { CTX, Schema } from './types';
import APIStateHub from './api-state-hub';
import { LocalStateHub } from './use-local-state';

export * from './types';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function Render({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  const apiStateHub = new APIStateHub(apiDoc, schema.apiStateSpec);
  const localStateHub = new LocalStateHub(schema.localStateSpec);

  apiStateHub.initContext(localStateHub);
  localStateHub.initContext(apiStateHub);

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: localStateHub,
  };

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return;
  }

  renderSchema({ node: instantiatedNode, ctx, rootEle });
}

export default Render;
