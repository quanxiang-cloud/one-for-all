export interface Rect {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface ElementRect {
  raw: DOMRectReadOnly;
  rect: Rect;
}

export type Report = Map< HTMLElement, ElementRect>;
