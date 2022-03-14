import schemaNode from '../raw/__tests__/fixtures/node';
import travel from '../travel';

test('travel_call_Visitors', () => {
  travel(schemaNode, {
    htmlElement: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    reactComponent: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    loopContainer: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    composedNode: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    refNode: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    jsxNode: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
    routeNode: (currentNode) => {
      console.log(`${currentNode.type}:${currentNode.id}`);
    },
  })
})
