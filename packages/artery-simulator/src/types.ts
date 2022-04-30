import type { HTMLNode, ReactComponentNode } from '@one-for-all/artery';
import type { Rect, ElementRect } from '@one-for-all/elements-radar';

export interface VisibleNode extends ElementRect {
  id: string;
  absolutePosition: Rect;
  executor: string;
}

export interface SimulatorReport {
  visibleNodes: VisibleNode[];
  areaHeight: number;
  areaWidth: number;
}

export interface ContourNode extends VisibleNode {
  depth: number;
  area: number;
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

export interface GreenZone {
  hoveringNodeID: string;
  position: Position;
  mostInnerNode: ContourNode;
}

export type NodeWithoutChild =
  | Pick<HTMLNode, 'type' | 'name'>
  | Pick<ReactComponentNode, 'type' | 'packageName' | 'packageVersion' | 'exportName'>;

export interface GreenZoneBetweenNodes {
  left: ContourNode;
  right: ContourNode;
  absolutePosition: Rect;
}
