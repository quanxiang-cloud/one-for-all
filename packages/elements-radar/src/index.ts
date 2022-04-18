import {
  merge,
  from,
  fromEvent,
  Observable,
  BehaviorSubject,
  Subject,
  Subscription,
  animationFrames,
} from 'rxjs';
import { switchMap, share, distinctUntilChanged, debounce, debounceTime } from 'rxjs/operators';

import { getReport, isSame } from './utils';
import type { Report, Rect } from './type';

export type { Report, Rect };

export default class Radar {
  private root: HTMLElement;
  private targets$: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>([]);
  private signal$: Observable<unknown>;
  private scrollSign$: Observable<unknown>;
  private resizeSign$: Subject<unknown> = new Subject();
  private report$: Observable<Report>;
  private resizeObserver: ResizeObserver;

  public constructor(root?: HTMLElement) {
    this.root = root || window.document.body;
    this.scrollSign$ = fromEvent(this.root, 'scroll');

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.root);

    // todo optimize this
    let previousElements: Array<Element> = [];
    this.targets$.subscribe((elements) => {
      previousElements.forEach((ele) => {
        this.resizeObserver.unobserve(ele);
      });

      elements.forEach((ele) => {
        this.resizeObserver.observe(ele);
      });

      previousElements = elements;
    });

    this.signal$ = merge(this.scrollSign$, this.targets$, this.resizeSign$).pipe(debounceTime(100));

    this.report$ = this.signal$.pipe(
      switchMap(() => from(getReport(this.targets$.value, this.root))),
      distinctUntilChanged(isSame),
      debounce(() => animationFrames()),
      share(),
    );
  }

  private onResize = (): void => {
    this.resizeSign$.next('resized');
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
    return this.report$.subscribe(listener);
  }

  public unListen(subscription: Subscription): void {
    subscription.unsubscribe();
  }
}
