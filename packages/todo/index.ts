import { schemaRender } from '@ofa/render-engine';
import schema from './todo-schema';

const rootEle = document.querySelector('#react-root');
if (rootEle) {
  schemaRender(schema, rootEle);
}
