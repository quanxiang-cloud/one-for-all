import renderEngine, { RenderEngineInstance } from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import apiDoc from './api-doc';

declare global {
  interface Window {
    renderEngineInstance: RenderEngineInstance;
  }
}
const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const renderRoot = document.querySelector('#react-root');

if (renderRoot) {
  window.renderEngineInstance = renderEngine({ schema, apiSpecAdapter, renderRoot });
}
