import type { HTMLNode, ReactComponentNode } from '@one-for-all/artery';
import type { Rect, ElementRect } from '@one-for-all/elements-radar';

export interface ContourNode extends ElementRect {
  id: string;
  absolutePosition: Rect;
  executor: string;
  depth: number;
}

export interface ContourNodesReport {
  contourNodes: ContourNode[];
  areaHeight: number;
  areaWidth: number;
}

export interface Cursor {
  x: number;
  y: number;
}

export type Position =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'inner'
  | 'inner-top'
  | 'inner-right'
  | 'inner-bottom'
  | 'inner-left';

export type NodeWithoutChild =
  | Pick<HTMLNode, 'type' | 'name'>
  | Pick<ReactComponentNode, 'type' | 'packageName' | 'packageVersion' | 'exportName'>;

export interface GreenZoneForNodeWithoutChildren {
  contour: ContourNode;
}

export interface GreenZoneAdjacentWithParent {
  type: 'adjacent-with-parent';
  parent: ContourNode;
  child: ContourNode;
  edge: 'left' | 'right';
  absolutePosition: Rect;
  raw: Rect;
}

export interface GreenZoneBetweenNodes {
  type: 'between-nodes';
  left: ContourNode;
  right: ContourNode;
  absolutePosition: Rect;
  raw: Rect;
}

export type GreenZoneInsideNode = GreenZoneAdjacentWithParent | GreenZoneBetweenNodes;
