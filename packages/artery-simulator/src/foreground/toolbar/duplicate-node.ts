import { ComposedNode, Node } from '@one-for-all/artery';
import { travel } from '@one-for-all/artery-utils';

function regenerateNodeID<T extends Node | ComposedNode>(node: T, genNodeID: () => string): T {
  node.id = genNodeID();
  return node;
}

// todo optimize performance
function duplicateNode(node: Node, genNodeID: () => string): Node {
  const newNode = travel(node, {
    htmlNode: (current) => regenerateNodeID(current, genNodeID),
    reactComponentNode: (current) => regenerateNodeID(current, genNodeID),
    loopContainerNode: (current) => regenerateNodeID(current, genNodeID),
    composedNode: (current) => regenerateNodeID(current, genNodeID),
    refNode: (current) => regenerateNodeID(current, genNodeID),
    jsxNode: (current) => regenerateNodeID(current, genNodeID),
    routeNode: (current) => regenerateNodeID(current, genNodeID),
  });

  return newNode;
}

export default duplicateNode;
