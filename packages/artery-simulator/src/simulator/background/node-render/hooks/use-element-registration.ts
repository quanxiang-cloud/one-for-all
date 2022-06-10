import { BehaviorSubject } from 'rxjs';

export function register(element: HTMLElement, monitoredElements$: BehaviorSubject<Set<HTMLElement>>): void {
  const monitoredElements = monitoredElements$.value;
  monitoredElements$.next(monitoredElements.add(element));
}

export function unregister(
  element: HTMLElement,
  monitoredElements$: BehaviorSubject<Set<HTMLElement>>,
): void {
  const monitoredElements = monitoredElements$.value;
  monitoredElements.delete(element);
  monitoredElements$.next(monitoredElements);
}
