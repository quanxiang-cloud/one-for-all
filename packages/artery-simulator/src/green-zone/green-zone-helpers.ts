import { byArbitrary, getFirstLevelConcreteChildren } from '@one-for-all/artery-utils';
import { Rect } from '@one-for-all/elements-radar';
import { ContourNode, GreenZoneBetweenNodes } from '../types';

function getFirstLevelConcreteChildrenContours(
  root: Immutable.Collection<unknown, unknown>,
  nodeID: string,
  contourNodes: ContourNode[]
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
  contourNodes: ContourNode[]
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
        Math.abs(left.absolutePosition.y + left.absolutePosition.height - right.absolutePosition.y)
      ),
    };

    return { left, right, absolutePosition };
  });

  return greenZoneBetweenNodes;
}
