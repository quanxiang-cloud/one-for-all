export interface Rect {
  x: number;
  y: number;
  height: number;
  width: number;
}

export type Report = Map<
  HTMLElement,
  {
    raw: DOMRectReadOnly;
    rect: Rect;
  }
>;
