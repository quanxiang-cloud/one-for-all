import renderEngine from '@ofa/render-engine';

import schema from './serialized-schema';
import apiDoc from './api-doc';

const rootEle = document.querySelector('#react-root');
if (rootEle) {
  renderEngine({ schema, apiDoc, rootEle });
}
