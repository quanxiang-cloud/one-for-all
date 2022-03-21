import { fromJS, Seq } from 'immutable';
import depth from '../depth';

import NODE from './fixtures/node';

test('SchemaUtils_depth_return_undefined_if_id_not_exist', () => {
  const node = fromJS(NODE);
  const d = depth(node, 'some_node_id_not_exist');
  expect(d).toBeUndefined();
});

test('SchemaUtils_depth_return_expected_value', () => {
  const node = fromJS(NODE);
  const d = depth(node, 'todo-delete');

  expect(d).toBe(3);
});
