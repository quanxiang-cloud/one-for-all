import { merge, fromEvent, BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, audit, tap, distinctUntilChanged } from 'rxjs/operators';

import { calcRect, isSame } from './utils';
import type { Report, Rect, ElementRect } from './type';

export type { Report, Rect, ElementRect };

export default class Radar {
  private targets$: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>([]);
  private resizeSign$: Subject<unknown> = new Subject();
  private resizeObserver: ResizeObserver;
  private report: Report = new Map();
  private reportUpdatedSign$ = new Subject<void>();
  private visibleObserver: IntersectionObserver;
  private root: HTMLElement | undefined;

  public constructor(root?: HTMLElement) {
    this.root = root;
    this.visibleObserver = new IntersectionObserver(this.intersectionObserverCallback, { root });

    const scroll$ = fromEvent(document, 'scroll');

    const scrollDone$ = new Subject<void>();
    let timer: number;
    scroll$.subscribe(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        scrollDone$.next();
      }, 250);
    });

    const scrollSign$ = scroll$.pipe(audit(() => scrollDone$));

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(document.body);

    this.targets$.subscribe((targets) => {
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(document.body);

      targets.forEach((target) => {
        this.resizeObserver.observe(target);
      });
    });

    // merge(scrollSign$, this.targets$, this.resizeSign$)
    merge(this.targets$, this.resizeSign$)
      .pipe(
        // auditTime(100),
        // debounce(() => animationFrames()),
        // auditTime(150),
        tap(() => {
          this.visibleObserver.disconnect();
        }),
      )
      .subscribe(() => {
        this.targets$.value.forEach((ele) => {
          this.visibleObserver.observe(ele);
        });
      });
  }

  private onResize = (): void => {
    this.resizeSign$.next('resized');
  };

  private intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
    if (!entries.length) {
      return;
    }

    const rootXY = this.root ? { x: entries[0].rootBounds?.x || 0, y: entries[0].rootBounds?.y || 0 } : { x: 0, y: 0 };
    this.report = new Map<HTMLElement, ElementRect>();
    entries.forEach(({ target, boundingClientRect, isIntersecting }) => {
      if (isIntersecting) {
        const relativeRect: Rect = calcRect(boundingClientRect, rootXY);
        this.report.set(target as HTMLElement, { relativeRect, raw: boundingClientRect });
      }
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

  public getReport$(): Observable<Report> {
    return this.reportUpdatedSign$.pipe(
      map(() => {
        // todo optimize this of making copy
        const newReport: Report = new Map();
        this.report.forEach((value, key) => newReport.set(key, value));
        return newReport;
      }),
      distinctUntilChanged(isSame),
    );
  }
}
