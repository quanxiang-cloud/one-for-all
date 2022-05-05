import { fromJS, Seq } from 'immutable';
import parentIdsSeq from '../parentIdsSeq';

import NODE from './fixtures/node';

test('SchemaUtils_parentIdsSeq_return_undefined_if_id_not_exist', () => {
  const node = fromJS(NODE);
  const idPath = parentIdsSeq(node, 'some_node_id_not_exist');
  expect(idPath).toBeUndefined();
});

test('SchemaUtils_parentIdsSeq_return_expected_value', () => {
  const node = fromJS(NODE);
  const idPath = parentIdsSeq(node, 'todo-delete');

  expect(idPath.toJS()).toStrictEqual(['container', 'todo-list-loop-composedNode', 'compose-node-container']);
});
