import React from 'react';
import { nanoid } from 'nanoid';

import { BasicTarget, ScrollElement, TargetElement } from './type';

export function uuid(): string {
  return nanoid();
}

export const inBrowser = typeof window !== 'undefined';

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}

export function isDef<T>(val?: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

export function isNumeric(val?: string): boolean {
  return isDef(val) ? /^\d+(\.\d+)?$/.test(val) : false;
}

export function addUnit(value?: NumberString): string | undefined {
  if (!isDef(value)) {
    return undefined;
  }

  const _value = String(value);
  return isNumeric(_value) ? `${_value}px` : _value;
}

export function getSizeStyle(
  originSize?: string | number,
  originStyle?: React.CSSProperties,
): React.CSSProperties {
  if (isDef(originSize)) {
    const size = addUnit(originSize);
    return {
      ...(originStyle || {}),
      width: size,
      height: size,
    };
  }
  return originStyle || {};
}

export function isHidden(elementRef?: HTMLElement): boolean {
  const el = elementRef;
  if (!el) {
    return false;
  }

  const style = window.getComputedStyle(el);
  const hidden = style.display === 'none';

  // offsetParent returns null in the following situations:
  // 1. The element or its parent element has the display property set to none.
  // 2. The element has the position property set to fixed
  const parentHidden = el.offsetParent === null && style.position !== 'fixed';
  return hidden || parentHidden;
}

export function isWindow(val: unknown): val is Window {
  return val === window;
}

// cache
let rootFontSize: number;

function getRootFontSize(): number {
  if (!rootFontSize) {
    const doc = document.documentElement;
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;

    rootFontSize = parseFloat(fontSize);
  }

  return rootFontSize;
}

function convertRem(value: string): number {
  const _value = value.replace(/rem/g, '');
  return +_value * getRootFontSize();
}

function convertVw(value: string): number {
  const _value = value.replace(/vw/g, '');
  return (+_value * window.innerWidth) / 100;
}

function convertVh(value: string): number {
  const _value = value.replace(/vh/g, '');
  return (+_value * window.innerHeight) / 100;
}

export function unitToPx(value: NumberString): number {
  if (typeof value === 'number') {
    return value;
  }

  if (inBrowser) {
    if (value.indexOf('rem') !== -1) {
      return convertRem(value);
    }
    if (value.indexOf('vw') !== -1) {
      return convertVw(value);
    }
    if (value.indexOf('vh') !== -1) {
      return convertVh(value);
    }
  }

  return parseFloat(value);
}

export function getZIndexStyle(
  zIndex?: NumberString,
  originStyle?: React.CSSProperties,
): React.CSSProperties {
  const style: React.CSSProperties = { ...(originStyle || {}) };
  if (zIndex !== undefined) {
    style.zIndex = +zIndex;
  }
  return style;
}
