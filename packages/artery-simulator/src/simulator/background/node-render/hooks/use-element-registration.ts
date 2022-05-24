import type { SimulatorLayerContext } from '../../context';

export function register(element: HTMLElement, layerCtx: SimulatorLayerContext): void {
  layerCtx.VISIBLE_ELEMENTS_OBSERVER.observe(element);
  const monitoredElements = layerCtx.monitoredElements$.value;
  layerCtx.monitoredElements$.next(monitoredElements);
}

export function unregister(element: HTMLElement, layerCtx: SimulatorLayerContext): void {
  layerCtx.VISIBLE_ELEMENTS_OBSERVER.unobserve(element);
  const monitoredElements = layerCtx.monitoredElements$.value;
  monitoredElements.delete(element);
  layerCtx.monitoredElements$.next(monitoredElements);
}
