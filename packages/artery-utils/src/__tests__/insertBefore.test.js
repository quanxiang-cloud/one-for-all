import schemaNode from '../raw/__tests__/fixtures/node';
import insertBefore from '../insertBefore';
import keyPathById from '../raw/keyPathById';
import { fromJS } from 'immutable';

test('insertBefore_return_expected_value', () => {
  const newRoot = insertBefore(schemaNode, 'todo-title', { id: 'some-inserted-node', type: 'html-node' });
  const insertedNodeKeyPath = keyPathById(fromJS(newRoot), 'some-inserted-node').toJS();

  expect(keyPathById(fromJS(schemaNode), 'todo-title').toJS()).toEqual(insertedNodeKeyPath);
});

describe('insertBefore_should_return_undefine', () => {
  test('reference_not_exist', () => {
    const newRoot = insertBefore(schemaNode, 'some-id-not-exist', {
      id: 'some-inserted-node',
      type: 'html-node',
    });
    expect(newRoot).toBeUndefined();
  });
});
