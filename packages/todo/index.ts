import { schemaRender } from '@ofa/render-engine';

import schema from './app-schema';
import apiDoc from './api-doc';

const rootEle = document.querySelector('#react-root');
if (rootEle) {
  schemaRender({ schema, apiDoc, rootEle });
}
