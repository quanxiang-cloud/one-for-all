import schemaNode from '../raw/__tests__/fixtures/node';
import insertAfter from '../insertAfter';
import _right from '../raw/right';
import keyPathById from '../raw/keyPathById';
import { fromJS } from 'immutable';

test('insertAfter_return_expected_value', () => {
  const newRoot = insertAfter(schemaNode, 'todo-title', { id: 'some-inserted-node', type: 'html-node' });
  const insertedNodeKeyPath = keyPathById(fromJS(newRoot), 'some-inserted-node').toJS();

  expect(_right(fromJS(newRoot), 'todo-title').toJS()).toEqual(insertedNodeKeyPath);
});

describe('insertAfter_should_return_undefine', () => {
  test('reference_not_exist', () => {
    const newRoot = insertAfter(schemaNode, 'some-id-not-exist', {
      id: 'some-inserted-node',
      type: 'html-node',
    });
    expect(newRoot).toBeUndefined();
  });
});
