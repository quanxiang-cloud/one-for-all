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
    // TODO: paint error
    return;
  }

  const stateHub = new StateHub(apiDoc, instantiatedSchema.statesMap);
  // TODO: give this a better design
  // each render-engine instance should have a uniq key,
  // this key could be used by stateHub,
  // or create a symbol for each stateHub?
  window.stateHub = stateHub;

  renderSchema({ schema: instantiatedSchema, stateHub, rootEle });
}

export default Render;
