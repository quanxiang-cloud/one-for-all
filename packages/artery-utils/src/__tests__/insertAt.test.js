import schemaNode from '../raw/__tests__/fixtures/node';
import insertAt from '../insertAt';
import _right from '../raw/right';
import keyPathById from '../raw/keyPathById';
import { fromJS } from 'immutable';
import _parent from '../raw/parent';
import getNodeParents from '../getNodeParents';

test('insertAt_return_expected_value', () => {
  const newRoot = insertAt(schemaNode, 'todo-title', 0, { id: 'some-inserted-node', type: 'html-node' });

  const _root = fromJS(newRoot);
  const parentNode = _root.getIn(_parent(_root, 'some-inserted-node'))

  expect(parentNode.getIn(['id'])).toBe('todo-title');
});

// describe('insertAt_should_return_undefine', () => {
//   test('reference_not_exist', () => {
//     const newRoot = insertAt(schemaNode, 'some-id-not-exist', {
//       id: 'some-inserted-node',
//       type: 'html-node',
//     });
//     expect(newRoot).toBeUndefined();
//   });
// });
