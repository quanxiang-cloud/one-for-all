import { BehaviorSubject, filter, Observable, ReplaySubject, Subject } from 'rxjs';
import immutable from 'immutable';
import {
  atom,
} from 'recoil';
import { ContourNode, GreenZone, GreenZoneBetweenNodes, ContourNodesReport } from './types';

export const immutableNodeState = atom<Immutable.Collection<unknown, unknown>>({
  key: 'immutableNodeState',
  // eslint-disable-next-line new-cap
  default: immutable.Map({}),
});

export const greenZoneState = atom<GreenZone | undefined>({ key: 'greenZoneState', default: undefined });

export const draggingNodeIDState = atom<string | undefined>({ key: 'draggingNodeIDState', default: undefined });

export const activeContourNodeState = atom<ContourNode | undefined>({
  key: 'activeContourNodeState',
  default: undefined,
});

export const contourNodesState = atom<ContourNode[]>({ key: 'contourNodesState', default: [] });

export const hoveringParentIDState = atom<string>({ key: 'hoveringParentIDState', default: '' });

export const visibleElementsTickState = atom<number>({ key: 'visibleElementsTickState', default: 0 });

export const isScrollingState = atom<boolean>({ key: 'isScrollingState', default: false });

export const greenZonesBetweenNodesState = atom<GreenZoneBetweenNodes[]>({ key: 'greenZonesBetweenNodesState', default: [] });

export const contourNodesReport$ = new BehaviorSubject<ContourNodesReport | undefined>(undefined);
export const hoveringContourNode$ = new Subject<ContourNode | undefined>();

export const ALL_BACKGROUND_ELEMENTS: Map<HTMLElement, boolean> = new Map();

export const backgroundElementsChanged$ = new ReplaySubject<void>(1);

function visibleObserverCallback(entries: IntersectionObserverEntry[]): void {
  entries.forEach(({ isIntersecting, target }) => {
    ALL_BACKGROUND_ELEMENTS.set(target as HTMLElement, isIntersecting);
  });
  backgroundElementsChanged$.next();
}

export const VISIBLE_ELEMENTS_OBSERVER = new IntersectionObserver(visibleObserverCallback);
