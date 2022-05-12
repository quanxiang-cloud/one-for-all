import { generateNodeId } from '@one-for-all/artery-engine';
import { ComposedNode, Node } from '@one-for-all/artery';
import { travel } from '@one-for-all/artery-utils';

function regenerateNodeID<T extends Node | ComposedNode>(node: T): T {
  node.id = generateNodeId(node.type);

  return node;
}

// todo optimize performance
function duplicateNode(node: Node): Node {
  const newNode = travel(node, {
    htmlNode: (current) => regenerateNodeID(current),
    reactComponentNode: (current) => regenerateNodeID(current),
    loopContainerNode: (current) => regenerateNodeID(current),
    composedNode: (current) => regenerateNodeID(current),
    refNode: (current) => regenerateNodeID(current),
    jsxNode: (current) => regenerateNodeID(current),
    routeNode: (current) => regenerateNodeID(current),
  });

  return newNode;
}

export default duplicateNode;
