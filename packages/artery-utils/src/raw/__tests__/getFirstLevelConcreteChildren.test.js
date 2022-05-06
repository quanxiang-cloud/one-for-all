import { fromJS } from 'immutable';
import NODE from './fixtures/node';
import getFirstLevelConcreteChildren from '../getFirstLevelConcreteChildren';

test('getFirstLevelConcreteChildren', () => {
  const node = fromJS(NODE);
  const firstLevelConcreteChildren = getFirstLevelConcreteChildren(node);
  const childrenIDs = firstLevelConcreteChildren.map((child) => {
    return child.getIn(['id']);
  });
  expect(childrenIDs).toMatchInlineSnapshot(`
    Array [
      "todo-input-container",
      "todo-toggle",
      "todo-title",
      "todo-delete",
      "footer",
    ]
  `);
});
