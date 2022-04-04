import schemaNode from '../raw/__tests__/fixtures/node';
import appendChild from '../appendChild';
import findNodeByID from '../findNodeByID';

test('appendChild_return_expected_value', () => {
  const child = { id: 'append-child', type: 'html-node' };
  const node = appendChild(schemaNode, 'todo-delete', child);
  expect(node).toBeTruthy();
  expect(findNodeByID(node, 'append-child')).toStrictEqual(child);
});
