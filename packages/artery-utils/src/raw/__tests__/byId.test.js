import { fromJS } from 'immutable';
import keyPathById from '../keyPathById';

import NODE from './fixtures/node';

test('SchemaUtils_byId', () => {
  const node = fromJS(NODE);
  const keyPath = keyPathById(node, 'todo-delete');

  expect(keyPath?.toJS()).toBeTruthy();
});
