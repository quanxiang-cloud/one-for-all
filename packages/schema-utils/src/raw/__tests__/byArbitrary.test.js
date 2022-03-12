import { fromJS } from 'immutable';
import byArbitrary from '../byArbitrary';

import NODE from './fixtures/node';

test('SchemaUtils_byArbitrary', () => {
  const node = fromJS(NODE);
  const keyPath = byArbitrary(node, 'todo-delete');

  expect(keyPath?.toJS()).toBeTruthy();
});
