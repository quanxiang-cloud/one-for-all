import renderEngine from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import apiDoc from './api-doc';

declare global {
  interface Window {
    ctx: any;
  }
}
const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const rootEle = document.querySelector('#react-root');

if (rootEle) {
  window.ctx = renderEngine({ schema, apiSpecAdapter, rootEle });
}
