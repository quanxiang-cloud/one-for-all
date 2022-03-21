import { fromJS, Seq } from 'immutable';
import filter from '../filter';

import NODE from './fixtures/node';

test('SchemaUtils_filter', () => {
  const node = fromJS(NODE);
  const keyPaths = filter(node, (childNode, keyPath) => {
    return childNode.getIn(['id']) === 'todo-delete';
  });

  expect(keyPaths?.toJS()).toBeTruthy();
  expect(keyPaths?.size).toBe(1);
});
