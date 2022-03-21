import { fromJS } from 'immutable';
import parent from '../parent';

import NODE from './fixtures/node';

test('SchemaUtils_filter', () => {
  const node = fromJS(NODE);
  const keyPaths = parent(node, 'todo-delete');

  expect(keyPaths?.toJS()).toBeTruthy();
  expect(keyPaths?.size).toBe(3);
});
