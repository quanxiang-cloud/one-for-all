import { OpenAPIV3 } from 'openapi-types';
import renderSchema from './render';
import deserializeSchema from './deserialize-schema';
import { Schema } from './types';
import APIStateHub from './api-state-hub';

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

  const stateHub = new APIStateHub(apiDoc, instantiatedSchema.apiStateSpec);
  // TODO: give this a better design
  // each render-engine instance should have a uniq key,
  // this key could be used by stateHub,
  // or create a symbol for each stateHub?
  //
  // store stateHub in context
  window.stateHub = stateHub;

  renderSchema({ schema: instantiatedSchema, stateHub, rootEle });
}

export default Render;
