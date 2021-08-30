import { OpenAPIV3 } from 'openapi-types';
import renderSchema from './src/render';
import deserializeSchema from './src/deserialize-schema';
import { Schema } from './src/types';
import StateHub from './src/state-hub';

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function Render({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  const instantiatedSchema = deserializeSchema(schema);
  if (!instantiatedSchema) {
    // todo paint error
    return;
  }

  const stateHub = new StateHub(apiDoc, instantiatedSchema.statesMap);
  // TODO: give this a better design
  window.stateHub = stateHub;

  renderSchema({ schema: instantiatedSchema, stateHub, rootEle });
}

export default Render;
