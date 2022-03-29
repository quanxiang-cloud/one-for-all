import { fromJS, Seq } from 'immutable';
import ancestors from '../ancestors';

import NODE from './fixtures/node';

test('SchemaUtils_ancestors_return_undefined_if_id_not_exist', () => {
  const node = fromJS(NODE);
  const ancestorList = ancestors(node, 'some_node_id_not_exist');
  expect(ancestorList).toBeUndefined();
});

test('SchemaUtils_ancestors_return_expected_value', () => {
  const node = fromJS(NODE);
  const ancestorList = ancestors(node, 'todo-delete');

  expect(ancestorList.toJS()).toStrictEqual([['children', 2, 'node'], ['children', 2], []]);
});
