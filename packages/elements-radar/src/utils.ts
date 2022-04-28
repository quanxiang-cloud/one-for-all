import type { Rect, Report } from './type';

const rectKeys: Array<keyof Rect> = ['height', 'width', 'x', 'y'];

export function isSame(previous: Report, current: Report): boolean {
  if (previous.size !== current.size) {
    return false;
  }

  return Array.from(previous.entries()).every(([element, { raw }]) => {
    const newRect = current.get(element);
    if (!newRect) {
      return false;
    }

    return rectKeys.every((key) => newRect.raw[key] === raw[key]);
  });
}

export function calcRect(raw: DOMRectReadOnly, rootBounds: DOMRectReadOnly | null): Rect {
  const X = rootBounds?.x || 0;
  const Y = rootBounds?.y || 0;

  const rect: Rect = {
    height: Math.round(raw.height),
    width: Math.round(raw.width),
    x: Math.round(raw.x - X),
    y: Math.round(raw.y - Y),
  };

  return rect;
}
