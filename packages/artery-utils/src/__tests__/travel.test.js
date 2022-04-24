import schemaNode from '../raw/__tests__/fixtures/node';
import travel from '../travel';

test('travel_call_Visitors', () => {
  const newRoot = travel(schemaNode, {
    htmlNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    reactComponentNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    loopContainerNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    composedNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    refNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    jsxNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
    routeNode: (currentNode) => {
      currentNode.id = `new__${currentNode.id}`;
      return currentNode;
    },
  });

  expect(newRoot).toMatchSnapshot();
});
