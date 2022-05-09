import {
  monitoredElements$,
  VISIBLE_ELEMENTS_OBSERVER,
} from '../../../atoms';

export function register(element: HTMLElement): void {
  VISIBLE_ELEMENTS_OBSERVER.observe(element);
  const monitoredElements = monitoredElements$.value;
  monitoredElements.set(element, false);
  monitoredElements$.next(monitoredElements);
}

export function unregister(element: HTMLElement): void {
  VISIBLE_ELEMENTS_OBSERVER.unobserve(element);
  const monitoredElements = monitoredElements$.value;
  monitoredElements.delete(element);
  monitoredElements$.next(monitoredElements);
}
