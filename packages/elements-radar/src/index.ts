import {
  merge,
  fromEvent,
  BehaviorSubject,
  Subject,
  Subscription,
} from 'rxjs';
import { map, audit, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';

import { calcRect, isSame } from './utils';
import type { Report, Rect, ElementRect } from './type';

export type { Report, Rect, ElementRect };

export default class Radar {
  private root: HTMLElement;
  private targets$: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>([]);
  private resizeSign$: Subject<unknown> = new Subject();
  private resizeObserver: ResizeObserver;
  private report: Report = new Map();
  private reportUpdatedSign$ = new Subject<void>();
  private visibleObserver: IntersectionObserver;

  public constructor(root?: HTMLElement) {
    this.root = root || window.document.body;
    this.visibleObserver = new IntersectionObserver(this.intersectionObserverCallback, { root: this.root });

    const scroll$ = fromEvent(this.root, 'scroll');

    const scrollDone$ = new Subject<void>();
    let timer: number;
    scroll$.subscribe(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        scrollDone$.next();
      }, 150);
    });

    const scrollSign$ = scroll$.pipe(
      audit(() => scrollDone$),
    );

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.root);

    merge(scrollSign$, this.targets$, this.resizeSign$).pipe(
      debounceTime(100),
      // debounce(() => animationFrames()),
      // auditTime(150),
      tap(() => {
        this.visibleObserver.disconnect();
      }),
    ).subscribe(() => {
      this.targets$.value.forEach((ele) => {
        this.visibleObserver.observe(ele);
      });
    });
  }

  private onResize = (): void => {
    this.resizeSign$.next('resized');
  };

  private intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(({ target, boundingClientRect, rootBounds, isIntersecting }) => {
      const relativeRect: Rect = calcRect(boundingClientRect, rootBounds);
      this.report.set(target as HTMLElement, { relativeRect, raw: boundingClientRect, visible: isIntersecting });
    });

    this.reportUpdatedSign$.next();
  };

  public addTargets(elements: HTMLElement[]): void {
    this.targets$.next([...this.targets$.value, ...elements]);
  }

  public removeTargets(element: Element[]): void {
    const leftTargets = this.targets$.value.filter((ele) => !element.includes(ele));
    this.track(leftTargets);
  }

  public track(elements: HTMLElement[]): void {
    this.targets$.next(elements);
  }

  public listen(listener: (report: Report) => void): Subscription {
    return this.reportUpdatedSign$.pipe(
      map(() => {
        const newReport: Report = new Map();
        this.report.forEach((value, key) => {
          if (value.visible) {
            newReport.set(key, value);
          }
        });

        return newReport;
      }),
      distinctUntilChanged(isSame),
    ).subscribe(listener);
  }

  public unListen(subscription: Subscription): void {
    subscription.unsubscribe();
  }
}
