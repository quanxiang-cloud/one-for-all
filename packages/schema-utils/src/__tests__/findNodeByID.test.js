import schemaNode from '../raw/__tests__/fixtures/node';
import findNodeByID from '../findNodeByID';

test('findNodeByID_return_expected_value', () => {
  const node = findNodeByID(schemaNode, 'todo-delete');
  expect(node.id).toBe('todo-delete');
});
