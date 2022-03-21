import schemaNode from '../raw/__tests__/fixtures/node';
import getNodeParents from '../getNodeParents';

test('getNodeParents_return_expected_value', () => {
  const parents = getNodeParents(schemaNode, 'todo-delete');

  expect(parents.map(({ id }) => id)).toStrictEqual(["container", "todo-list-loop-composedNode", "compose-node-container"]);
});
