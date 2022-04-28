export interface Rect {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface ElementRect {
  raw: DOMRectReadOnly;
  relativeRect: Rect;
  visible: boolean;
}

export type Report = Map< HTMLElement, ElementRect>;
