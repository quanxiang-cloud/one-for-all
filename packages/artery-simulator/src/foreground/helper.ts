import { Node } from '@one-for-all/artery';
import {
  deleteByID,
  findNodeByID,
  insertAfter,
  insertBefore,
  appendChild,
  insertAt,
} from '@one-for-all/artery-utils';
import { logger } from '@one-for-all/utils';
import { Position } from '../types';

interface MoveNodeParams {
  root: Node;
  draggingNodeID: string;
  hoveringNodeID: string;
  position: Position;
}

export function moveNode({
  root,
  draggingNodeID,
  hoveringNodeID,
  position,
}: MoveNodeParams): Node | undefined {
  let _root: Node | undefined = root;
  const nodeToMove = findNodeByID(root, draggingNodeID);
  if (!nodeToMove) {
    logger.error(`can not find source node: ${draggingNodeID}, the move operation will be skipped`);
    return root;
  }

  _root = deleteByID(root, nodeToMove.id);
  if (position === 'right' || position === 'bottom') {
    return insertAfter(_root, hoveringNodeID, nodeToMove);
  }

  if (position === 'left' || position === 'top') {
    return insertBefore(_root, hoveringNodeID, nodeToMove);
  }

  if (position === 'inner-right' || position === 'inner-bottom') {
    return appendChild(_root, hoveringNodeID, nodeToMove);
  }

  if (position === 'inner-left' || position === 'inner-top' || position === 'inner') {
    return insertAt(_root, hoveringNodeID, 0, nodeToMove);
  }

  logger.error('unimplemented move position:', position);

  return root;
}

interface DropNodeParams {
  root: Node;
  node: Node;
  hoveringNodeID: string;
  position: Position;
}

export function dropNode({ root, node, hoveringNodeID, position }: DropNodeParams): Node | undefined {
  if (position === 'right' || position === 'bottom') {
    return insertAfter(root, hoveringNodeID, node);
  }

  if (position === 'left' || position === 'top') {
    return insertBefore(root, hoveringNodeID, node);
  }

  if (position === 'inner-right' || position === 'inner-bottom') {
    return appendChild(root, hoveringNodeID, node);
  }

  if (position === 'inner-left' || position === 'inner-top' || position === 'inner') {
    return insertAt(root, hoveringNodeID, 0, node);
  }

  logger.error('unimplemented drop position:', position);

  return root;
}

export function jsonParse<T>(json: string): T | undefined {
  try {
    return JSON.parse(json);
  } catch (error) {
    return;
  }
}
