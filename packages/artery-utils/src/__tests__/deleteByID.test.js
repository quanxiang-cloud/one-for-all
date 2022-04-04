import schemaNode from '../raw/__tests__/fixtures/node';
import findNodeByID from '../findNodeByID';
import deleteByID from '../deleteByID';

test('deleteByID_return_expected_value', () => {
  const node = deleteByID(schemaNode, 'todo-delete');
  expect(findNodeByID(node, 'todo-delete')).toBeUndefined();
});
