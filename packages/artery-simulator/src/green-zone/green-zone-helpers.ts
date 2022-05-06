import { byArbitrary, getFirstLevelConcreteChildren } from '@one-for-all/artery-utils';
import { Rect } from '@one-for-all/elements-radar';
import {
  ContourNode,
  GreenZoneAdjacentWithParent,
  GreenZoneBetweenNodes,
  GreenZoneInsideNode,
} from '../types';

// todo optimize performance
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

  const ids: string[] = getFirstLevelConcreteChildren(parentNode).map(
    (child) => child.getIn(['id']) as string,
  );
  return contourNodes.filter(({ id }) => ids.includes(id));
}
// type NearestEdge = 'left' | 'right';
const MIN_GAP = 2;
function findNearestRightSibling(current: ContourNode, children: ContourNode[]): ContourNode | undefined {
  return children
    .filter((sibling) => {
      if (sibling.id === current.id) {
        return false;
      }

      if (current.raw.x + current.raw.width + MIN_GAP > sibling.raw.x) {
        return false;
      }

      if (current.raw.y > sibling.raw.y + sibling.raw.height) {
        return false;
      }

      if (current.raw.y + current.raw.height < sibling.raw.y) {
        return false;
      }

      return true;
    })
    .sort((a, b): number => {
      const X = current.raw.x + current.raw.width;
      const toALeftEdgeDistance = a.raw.x - X;
      const toBLeftEdgeDistance = b.raw.x - X;

      return toALeftEdgeDistance < toBLeftEdgeDistance ? -1 : 1;
    })
    .shift();
}

function findRightSiblings(current: ContourNode, allSiblings: ContourNode[]): ContourNode[] {
  return allSiblings.filter((sibling) => {
    if (sibling.id === current.id) {
      return false;
    }

    if (current.raw.x + current.raw.width + MIN_GAP > sibling.raw.x) {
      return false;
    }

    if (current.raw.y > sibling.raw.y + sibling.raw.height) {
      return false;
    }

    if (current.raw.y + current.raw.height < sibling.raw.y) {
      return false;
    }

    return true;
  });
}

function toGreenZoneBetweenNodes(
  current: ContourNode,
  rightSiblings: ContourNode[],
): GreenZoneBetweenNodes[] {
  return rightSiblings.map((right) => {
    const absolutePosition: Rect = {
      x: current.absolutePosition.x + current.absolutePosition.width,
      y: Math.min(current.absolutePosition.y, right.absolutePosition.y),
      width: right.absolutePosition.x - (current.absolutePosition.x + current.absolutePosition.width),
      height: Math.min(
        Math.abs(current.absolutePosition.y - (right.absolutePosition.y + right.absolutePosition.height)),
        Math.abs(current.absolutePosition.y + current.absolutePosition.height - right.absolutePosition.y),
      ),
    };

    const raw: Rect = {
      x: current.raw.x + current.absolutePosition.width,
      y: Math.min(current.raw.y, right.raw.y),
      width: absolutePosition.width,
      height: absolutePosition.height,
    };

    return { left: current, right, absolutePosition, type: 'between-nodes', raw };
  });
}

function hasInterSection(rectA: Rect, rectB: Rect): boolean {
  const xAxisProjectionReactA: [number, number] = [rectA.x, rectA.x + rectA.width];
  const xAxisProjectionReactB: [number, number] = [rectB.x, rectB.x + rectB.width];
  const yAxisProjectionRectA: [number, number] = [rectA.y, rectA.y + rectA.height];
  const yAxisProjectionRectB: [number, number] = [rectB.y, rectB.y + rectB.height];

  const maxStartX = Math.max(xAxisProjectionReactA[0], xAxisProjectionReactB[0]);
  const minEndX = Math.min(xAxisProjectionReactA[1], xAxisProjectionReactB[1]);
  const maxStartY = Math.max(yAxisProjectionRectA[0], yAxisProjectionRectB[0]);
  const minEndY = Math.min(yAxisProjectionRectA[1], yAxisProjectionRectB[1]);

  return maxStartX < minEndX && maxStartY < minEndY;
}

function filterGreenZonesIntersectionWithNode(
  greenZones: GreenZoneBetweenNodes[],
  contours: ContourNode[],
): GreenZoneBetweenNodes[] {
  return greenZones.filter(({ absolutePosition }) => {
    const isInterSecting = contours.some((contour) =>
      hasInterSection(contour.absolutePosition, absolutePosition),
    );
    return !isInterSecting;
  });
}

function getGreenZonesWithParent(
  parent: ContourNode,
  children: ContourNode[],
): GreenZoneAdjacentWithParent[] {
  const greenZoneBetweenParentLeftEdge = children.map<GreenZoneAdjacentWithParent>((child) => {
    const raw: Rect = {
      x: parent.raw.x,
      y: child.raw.y,
      height: child.absolutePosition.height,
      width: child.absolutePosition.x - parent.absolutePosition.x,
    };

    return {
      type: 'adjacent-with-parent',
      parent: parent,
      child: child,
      edge: 'left',
      raw,
      absolutePosition: {
        x: parent.absolutePosition.x,
        y: child.absolutePosition.y,
        height: child.absolutePosition.height,
        width: child.absolutePosition.x - parent.absolutePosition.x,
      },
    };
  });

  const greenZoneBetweenParentRightEdge = children.map<GreenZoneAdjacentWithParent>((child) => {
    const X = child.absolutePosition.x + child.absolutePosition.width;
    const raw: Rect = {
      x: child.raw.x + child.absolutePosition.width,
      y: child.raw.y,
      height: child.absolutePosition.height,
      width: parent.absolutePosition.x + parent.absolutePosition.width - X,
    };

    return {
      raw,
      type: 'adjacent-with-parent',
      parent: parent,
      child: child,
      edge: 'right',
      absolutePosition: {
        x: X,
        y: child.absolutePosition.y,
        height: child.absolutePosition.height,
        width: parent.absolutePosition.x + parent.absolutePosition.width - X,
      },
    };
  });

  return greenZoneBetweenParentLeftEdge.concat(greenZoneBetweenParentRightEdge).filter((greenZone) => {
    if (greenZone.absolutePosition.height < 4 || greenZone.absolutePosition.width < 4) {
      return false;
    }

    return !children.some(({ absolutePosition }) =>
      hasInterSection(absolutePosition, greenZone.absolutePosition),
    );
  });
}

export function calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(
  root: Immutable.Collection<unknown, unknown>,
  hoveringContour: ContourNode,
  contourNodes: ContourNode[],
): Array<GreenZoneInsideNode> {
  const firstLevelChildrenContours = getFirstLevelConcreteChildrenContours(
    root,
    hoveringContour.id,
    contourNodes,
  );

  const greenZonesBetweenNodes = firstLevelChildrenContours
    .map((current) => {
      const rightSiblings = findRightSiblings(current, firstLevelChildrenContours);
      return toGreenZoneBetweenNodes(current, rightSiblings);
    })
    .reduce((acc, greenZones) => acc.concat(greenZones), []);
  const filteredGreenZones = filterGreenZonesIntersectionWithNode(
    greenZonesBetweenNodes,
    firstLevelChildrenContours,
  );

  const greenZonesWithParent = getGreenZonesWithParent(hoveringContour, firstLevelChildrenContours);

  return [...filteredGreenZones, ...greenZonesWithParent];
}
