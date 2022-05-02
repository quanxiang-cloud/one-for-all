import {
  backgroundElementsChanged$,
  ALL_BACKGROUND_ELEMENTS,
  VISIBLE_ELEMENTS_OBSERVER,
} from '../../../atoms';

export function register(element: HTMLElement): void {
  VISIBLE_ELEMENTS_OBSERVER.observe(element);
  ALL_BACKGROUND_ELEMENTS.set(element, false);
}

export function unregister(element: HTMLElement): void {
  VISIBLE_ELEMENTS_OBSERVER.unobserve(element);
  ALL_BACKGROUND_ELEMENTS.delete(element);
  backgroundElementsChanged$.next();
}
