import { GreenZone, ShadowNode, Position } from '../types';

interface Cursor {
  nodeID: string;
  x: number;
  y: number;
}

function isInside(x: number, y: number, rect: DOMRectReadOnly): boolean {
  return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}

function getMostInner(cursor: Cursor, shadowNodes: ShadowNode[]): ShadowNode | undefined {
  let mostInner: ShadowNode | undefined = undefined;
  let smallestArea = Infinity;

  for (const current of shadowNodes) {
    if (!isInside(cursor.x, cursor.y, current.raw)) {
      continue;
    }

    const area = current.area;
    if (area > smallestArea) {
      continue;
    }

    smallestArea = area;
    mostInner = current;
  }

  return mostInner;
}

interface GetPositionParam {
  x: number;
  y: number;
  rect: DOMRectReadOnly;
  supportInner: boolean;
}

// TODO optimize this
function getPosition({ x, rect, supportInner }: GetPositionParam): Position {
  const leftDistance = Math.abs(x - rect.left);
  const rightDistance = Math.abs(x - rect.right);

  if (!supportInner) {
    return leftDistance < rightDistance ? 'left' : 'right';
  }

  const oneThirdWidth = rect.width / 3;
  if (leftDistance < oneThirdWidth) {
    return 'inner-left';
  }

  if (rightDistance < oneThirdWidth) {
    return 'inner-right';
  }

  return 'inner';
}

function calcGreenZone(cursor: Cursor, shadowNodes: ShadowNode[]): GreenZone | undefined {
  const _shadowNodes = shadowNodes.filter(({ id, nodePath }) => {
    if (id === cursor.nodeID) {
      return false;
    }

    // exclude children node
    if (nodePath.includes(cursor.nodeID)) {
      return false;
    }

    return true;
  });

  const mostInner = getMostInner(cursor, _shadowNodes);
  if (!mostInner) {
    return;
  }

  const position = getPosition({
    x: cursor.x,
    y: cursor.y,
    rect: mostInner.raw,
    supportInner: mostInner.supportChildren,
  });

  return { position, hoveringNodeID: mostInner.id, mostInnerNode: mostInner };
}

export default calcGreenZone;
