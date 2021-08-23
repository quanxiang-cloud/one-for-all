import { schemaRender } from '@ofa/render-engine';
import schema from './todo-app-schema';
import apiDoc from './todo-spec';

const rootEle = document.querySelector('#react-root');
if (rootEle) {
  schemaRender({ schema, apiDoc, rootEle });
}
