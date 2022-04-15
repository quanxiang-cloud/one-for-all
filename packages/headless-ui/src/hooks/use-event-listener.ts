import { useEffect } from 'react';

import { inBrowser, getTargetElement } from '../utils';
import { BasicTarget, TargetElement } from '../type';

let supportsPassive = false;

interface Window {
  addEventListener: (
    type: string,
    listener: (() => void) | null,
    opts: boolean | AddEventListenerOptions,
  ) => void;
}

if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      },
    });
    (window as Window).addEventListener('test-passive', null, opts);
  } catch (e) {
    // No-op
  }
}

type Target = BasicTarget<TargetElement>;

export interface UseEventListenerOptions {
  target?: Target;
  capture?: boolean;
  passive?: boolean;
  depends?: Array<unknown>;
}

function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {},
): void {
  if (!inBrowser) {
    return;
  }
  const { target = window, passive = false, capture = false, depends = [] } = options;
  let attached: boolean;

  const add = (): void => {
    const element = getTargetElement(target);

    if (element && !attached) {
      element.addEventListener(type, listener, supportsPassive ? { capture, passive } : capture);
      attached = true;
    }
  };

  const remove = (): void => {
    const element = getTargetElement(target);

    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };

  useEffect(() => {
    add();
    return () => remove();
  }, [target, ...depends]);
}

export default useEventListener;
