import schemaNode from '../raw/__tests__/fixtures/node';
import patchNode from '../patchNode';
import findNodeByID from '../findNodeByID';
import { getIn } from 'immutable';

test('patchNode_return_expected_value', () => {
  const node = patchNode(schemaNode, {
    id: 'todo-delete',
    props: { name: { type: 'constant_property', value: 'some_value' } },
  });
  const value = getIn(findNodeByID(node, 'todo-delete'), ['props', 'name', 'value']);

  expect(value).toBe('some_value');
});
