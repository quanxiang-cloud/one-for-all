import { Node } from '@one-for-all/artery';
import { generateNodeId } from '@one-for-all/artery-engine';
import {
  byArbitrary,
  _appendTo,
  ImmutableNode,
  _insertLeftSiblingTo,
  _insertRightSiblingTo,
  ComposedNode,
  travel,
} from '@one-for-all/artery-utils';
import { removeIn } from 'immutable';
import type { GreenZone } from '../../types';

interface MoveNodeParams {
  rootNode: ImmutableNode;
  nodeID: string;
  greenZone: GreenZone;
}

export function moveNode({ rootNode, nodeID, greenZone }: MoveNodeParams): ImmutableNode | undefined {
  let _rootNode: ImmutableNode = rootNode;
  const nodeToMoveKeyPath = byArbitrary(rootNode, nodeID);
  if (!nodeToMoveKeyPath) {
    return;
  }

  const nodeToMove = rootNode.getIn(nodeToMoveKeyPath) as ImmutableNode | undefined;
  if (!nodeToMove) {
    return;
  }

  _rootNode = removeIn(rootNode, nodeToMoveKeyPath);

  return insertNode({ rootNode: _rootNode, node: nodeToMove, greenZone });
}

interface InsertNodeParams {
  rootNode: ImmutableNode;
  node: Node | ImmutableNode;
  greenZone: GreenZone;
}

export function insertNode({ rootNode, node, greenZone }: InsertNodeParams): ImmutableNode | undefined {
  if (
    greenZone.type === 'node_without_children' &&
    (greenZone.position === 'inner' ||
      greenZone.position === 'inner-left' ||
      greenZone.position === 'inner-right')
  ) {
    return _appendTo(rootNode, greenZone.contour.id, node);
  }

  if (greenZone.type === 'node_without_children' && greenZone.position === 'left') {
    return _insertLeftSiblingTo(rootNode, greenZone.contour.id, node);
  }

  if (greenZone.type === 'node_without_children' && greenZone.position === 'right') {
    return _insertRightSiblingTo(rootNode, greenZone.contour.id, node);
  }

  if (greenZone.type === 'adjacent-with-parent' && greenZone.edge === 'left') {
    return _insertLeftSiblingTo(rootNode, greenZone.child.id, node);
  }

  if (greenZone.type === 'adjacent-with-parent' && greenZone.edge === 'right') {
    return _insertRightSiblingTo(rootNode, greenZone.child.id, node);
  }

  if (greenZone.type !== 'between-nodes') {
    return;
  }

  if (greenZone.left.absolutePosition.height < greenZone.right.absolutePosition.height) {
    return _insertRightSiblingTo(rootNode, greenZone.left.id, node);
  }

  if (greenZone.left.absolutePosition.height > greenZone.right.absolutePosition.height) {
    return _insertLeftSiblingTo(rootNode, greenZone.right.id, node);
  }

  return _insertRightSiblingTo(rootNode, greenZone.left.id, node);
}

export function jsonParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json);
  } catch (error) {
    return;
  }
}

function regenerateNodeID<T extends Node | ComposedNode>(node: T): T {
  node.id = generateNodeId(node.type);

  return node;
}

// todo optimize performance
export function duplicateNode(node: Node): Node {
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
