import type { Node, HTMLNode, ReactComponentNode } from '@one-for-all/artery';
import type { Rect, ElementRect } from '@one-for-all/elements-radar';

export interface ContourNode extends ElementRect {
  id: string;
  absolutePosition: Rect;
  executor: string;
  depth: number;
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

export type NodePrimary =
  | Pick<HTMLNode, 'type' | 'name'>
  | Pick<ReactComponentNode, 'type' | 'packageName' | 'packageVersion' | 'exportName'>;

export interface GreenZoneForNodeWithoutChildren {
  type: 'node_without_children';
  contour: ContourNode;
  position: Position;
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

export interface FallbackContourGreenZone {
  type: 'fallback-contour-green-zone';
}

export type GreenZoneInsideNode = GreenZoneAdjacentWithParent | GreenZoneBetweenNodes;

export type GreenZone = GreenZoneAdjacentWithParent | GreenZoneBetweenNodes | GreenZoneForNodeWithoutChildren | FallbackContourGreenZone;

export interface MoveNodeRequest {
  type: 'move_node_request';
  nodeID: string;
}

export interface DropNodeRequest {
  type: 'insert_node_request';
  node: Node;
}

export type DropRequest = MoveNodeRequest | DropNodeRequest;
