import schemaNode from '../raw/__tests__/fixtures/node';
import getNodeParentIDs from '../getNodeParentIDs';

test('getNodeParentIDs_return_expected_value', () => {
  const ids = getNodeParentIDs(schemaNode, 'todo-delete');
  expect(ids).toStrictEqual(['container', 'todo-list-loop-composedNode', 'compose-node-container']);
});
