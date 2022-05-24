import { parentIdsSeq } from '@one-for-all/artery-utils';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { removeIn } from 'immutable';
import { generateNodeId } from '@one-for-all/artery-engine';
import type { Node } from '@one-for-all/artery';
import {
  byArbitrary,
  _appendTo,
  ImmutableNode,
  _insertLeftSiblingTo,
  _insertRightSiblingTo,
  ComposedNode,
  travel,
} from '@one-for-all/artery-utils';

import type { GreenZone, Cursor, Position, NodePrimary } from '../types';

const img = new Image();
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

export function overrideDragImage(dateTransfer: DataTransfer): void {
  dateTransfer.setDragImage(img, 0, 0);
}

interface GetPositionParam {
  cursor: Cursor;
  hoveringRect: DOMRectReadOnly;
  supportInner: boolean;
}

// TODO optimize this
export function calcHoverPosition({ cursor, hoveringRect, supportInner }: GetPositionParam): Position {
  const leftDistance = Math.abs(cursor.x - hoveringRect.left);
  const rightDistance = Math.abs(cursor.x - hoveringRect.right);
  if (!supportInner) {
    return leftDistance < rightDistance ? 'left' : 'right';
  }

  if (leftDistance <= 9) {
    return 'left';
  }

  if (rightDistance <= 9) {
    return 'right';
  }

  const oneThirdWidth = hoveringRect.width / 3;
  if (leftDistance < oneThirdWidth) {
    return 'inner-left';
  }

  if (rightDistance < oneThirdWidth) {
    return 'inner-right';
  }

  return 'inner';
}

export function isChildNodeOf(
  root: Immutable.Collection<unknown, unknown>,
  parentID: string,
  childID: string,
): boolean {
  const parentIDs = parentIdsSeq(root, childID);
  if (!parentIDs) {
    return false;
  }

  return parentIDs.keyOf(parentID) !== undefined ? true : false;
}

export function getNodeExecutor(node: NodePrimary): string {
  if (node.type === 'html-element') {
    return `html-element:${node.name}`;
  }

  if (node.type === 'react-component') {
    return `react_component:${node.packageName}:${node.packageVersion}:${node.exportName}`;
  }

  return '';
}

export function useBehaviorSubjectState<T>(subject: BehaviorSubject<T>): T {
  const [state, setState] = useState(subject.value);

  useEffect(() => {
    const subscription = subject.subscribe(setState);
    return () => {
      subscription.unsubscribe();
    };
  }, [subject]);

  return state;
}

export function jsonParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json);
  } catch (error) {
    return;
  }
}

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
