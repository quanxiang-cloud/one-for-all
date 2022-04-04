import { fromJS, Seq } from 'immutable';
import nodes from '../nodes';

import NODE from './fixtures/node';

test('SchemaUtils_nodes', () => {
  const node = fromJS(NODE);
  console.log(nodes(node).toJS());
});
