import { byArbitrary, getFirstLevelConcreteChildren, parentIdsSeq } from '@one-for-all/artery-utils';
import { Rect } from '@one-for-all/elements-radar';
import { useSetRecoilState } from 'recoil';
import { visibleElementsTickState } from './atoms';
import { ContourNode, Cursor, GreenZoneBetweenNodes, Position } from './types';
import { NodeWithoutChild } from './types';

let n = 0;

export function useNextTick(): () => void {
  const next = useSetRecoilState(visibleElementsTickState);

  return () => {
    n = n + 1;
    next(n);
  };
}

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

const isNodeSupportChildrenCache: Map<string, boolean> = new Map();

export function cacheIsNodeSupportChildren(node: NodeWithoutChild, isSupport: boolean): void {
  const cacheKey = getNodeExecutor(node);

  isNodeSupportChildrenCache.set(cacheKey, isSupport);
}

export function getIsNodeSupportCache(nodeExecutor: string): boolean | undefined {
  return isNodeSupportChildrenCache.get(nodeExecutor);
}

export function isChildNodeOf(
  root: Immutable.Collection<unknown, unknown>,
  parentID: string,
  childID: string,
): boolean {
  const parentIDs = parentIdsSeq(root, parentID);
  if (!parentIDs) {
    return false;
  }

  return parentIDs.keyOf(childID) !== undefined ? false : true;
}

export function getNodeExecutor(node: NodeWithoutChild): string {
  if (node.type === 'html-element') {
    return `html-element:${node.name}`;
  }

  if (node.type === 'react-component') {
    return `react_component:${node.packageName}:${node.packageVersion}:${node.exportName}`;
  }

  return '';
}

function getFirstLevelConcreteChildrenContours(
  root: Immutable.Collection<unknown, unknown>,
  nodeID: string,
  contourNodes: ContourNode[],
): Array<ContourNode> {
  const nodeKeyPath = byArbitrary(root, nodeID);
  if (!nodeKeyPath) {
    return [];
  }

  const parentNode = root.getIn(nodeKeyPath) as Immutable.Collection<unknown, unknown>;
  if (!parentNode) {
    return [];
  }

  const ids: string[] = getFirstLevelConcreteChildren(parentNode).map((child) => child.getIn(['id']) as string);
  return contourNodes.filter(({ id }) => ids.includes(id));
}

// type NearestEdge = 'left' | 'right';

const MIN_GAP = 2;

function findNearestRightSibling(current: ContourNode, children: ContourNode[]): ContourNode | undefined {
  return children.filter((sibling) => {
    if (sibling.id === current.id) {
      return false;
    }

    if ((current.raw.x + current.raw.width + MIN_GAP) > sibling.raw.x) {
      return false;
    }

    if (current.raw.y > (sibling.raw.y + sibling.raw.height)) {
      return false;
    }

    if ((current.raw.y + current.raw.height) < sibling.raw.y) {
      return false;
    }

    return true;
  }).sort((a, b): number => {
    const X = current.raw.x + current.raw.width;
    const toALeftEdgeDistance = a.raw.x - X;
    const toBLeftEdgeDistance = b.raw.x - X;

    return toALeftEdgeDistance < toBLeftEdgeDistance ? -1 : 1;
  }).shift();
}

export function calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(
  root: Immutable.Collection<unknown, unknown>,
  hoveringContour: ContourNode,
  contourNodes: ContourNode[],
): GreenZoneBetweenNodes[] {
  const firstLevelChildrenContours = getFirstLevelConcreteChildrenContours(root, hoveringContour.id, contourNodes);
  const greenZoneBetweenNodes = firstLevelChildrenContours.map((current) => {
    const rightSibling = findNearestRightSibling(current, firstLevelChildrenContours);
    if (!rightSibling) {
      return;
    }

    return [current, rightSibling];
  }).filter((pair): pair is [ContourNode, ContourNode] => !!pair).map(([left, right]) => {
    const absolutePosition: Rect = {
      x: left.absolutePosition.x + left.absolutePosition.width,
      y: Math.min(left.absolutePosition.y, right.absolutePosition.y),
      width: right.absolutePosition.x - (left.absolutePosition.x + left.absolutePosition.width),
      height: Math.min(
        Math.abs(left.absolutePosition.y - (right.absolutePosition.y + right.absolutePosition.height)),
        Math.abs(left.absolutePosition.y + left.absolutePosition.height - right.absolutePosition.y),
      ),
    };

    return { left, right, absolutePosition };
  });

  return greenZoneBetweenNodes;
}
