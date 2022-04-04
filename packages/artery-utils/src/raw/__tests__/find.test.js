import { fromJS, Seq } from 'immutable';
import find from '../find';

import NODE from './fixtures/node';

test('SchemaUtils_find', () => {
  const node = fromJS(NODE);
  const keyPath = find(node, (childNode, keyPath) => {
    return childNode.getIn(['id']) === 'todo-delete';
  });

  expect(keyPath?.toJS()).toBeTruthy();
  expect(keyPath?.size).toBe(5);
});
