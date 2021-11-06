import { OpenAPIV3 } from 'openapi-types';
import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { Schema } from './types';
import APIStateHub from './api-state-hub';
import { LocalStateHub } from './use-local-state';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function Render({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  const instantiatedSchema = deserializeSchema(schema);
  if (!instantiatedSchema) {
    // TODO: paint error
    return;
  }

  const apiStateHub = new APIStateHub(apiDoc, instantiatedSchema.apiStateSpec);
  const localStateHub = new LocalStateHub();
  localStateHub.initContext(apiStateHub);

  renderSchema({ schema: instantiatedSchema, apiStateHub: apiStateHub, rootEle });
}

export default Render;
