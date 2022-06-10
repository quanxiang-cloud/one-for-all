import { fromJS } from 'immutable';
import _insertRightSiblingTo from '../_insertRightSiblingTo';
import NODE from './fixtures/first-level-concrete-children';

// test('_insertRightSiblingTo_to_end', () => {
//   const rootNode = fromJS(NODE);

//   const newRoot = _insertRightSiblingTo(rootNode, 'todo-filter', { foo: 'bar '});

//   expect(newRoot.toJS()).toMatchSnapshot();
// })

test('_insertRightSiblingTo_to_middle', () => {
  const rootNode = fromJS(NODE);

  const newRoot = _insertRightSiblingTo(rootNode, 'todo-list-loop-composedNode', { foo: 'bar '});

  expect(newRoot.toJS()).toMatchSnapshot();
})
