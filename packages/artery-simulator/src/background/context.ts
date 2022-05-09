import React from "react";
import { BehaviorSubject, noop } from "rxjs";

export type SimulatorLayerContext = {
  VISIBLE_ELEMENTS_OBSERVER: IntersectionObserver;
  monitoredElements$: BehaviorSubject<Map<HTMLElement, boolean>>;
}

export function createLayerContextVal(): SimulatorLayerContext {
  function visibleObserverCallback(entries: IntersectionObserverEntry[]): void {
    const monitoredElements = monitoredElements$.value;
    entries.forEach(({ isIntersecting, target }) => {
      monitoredElements.set(target as HTMLElement, isIntersecting);
    });
    monitoredElements$.next(monitoredElements);
  }

  const monitoredElements$ = new BehaviorSubject<Map<HTMLElement, boolean>>(new Map());
  const VISIBLE_ELEMENTS_OBSERVER = new IntersectionObserver(visibleObserverCallback);

  return { monitoredElements$, VISIBLE_ELEMENTS_OBSERVER };
}

const SimulatorLayerCtx = React.createContext<SimulatorLayerContext>({
  monitoredElements$: new BehaviorSubject<Map<HTMLElement, boolean>>(new Map()),
  VISIBLE_ELEMENTS_OBSERVER: new IntersectionObserver(noop),
});

export default SimulatorLayerCtx;
