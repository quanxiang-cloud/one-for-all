import renderEngine from '@ofa/render-engine';

import schema from './serialized-schema';
import apiDoc from './api-doc';

declare global {
  interface Window {
    ctx: any;
  }
}

const rootEle = document.querySelector('#react-root');
if (rootEle) {
  window.ctx = renderEngine({ schema, apiDoc, rootEle });
}
