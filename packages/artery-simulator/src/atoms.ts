import { BehaviorSubject, map, observable, Observable, ReplaySubject, Subject } from 'rxjs';
import immutable, { fromJS } from 'immutable';
import { atom, selector } from 'recoil';
import {
  ContourNode,
  GreenZoneBetweenNodes,
  ContourNodesReport,
  Cursor,
  GreenZoneInsideNode,
  Position,
  GreenZoneForNodeWithoutChildren,
  GreenZone,
} from './types';
import { byArbitrary, walk, ImmutableNode, filter } from '@one-for-all/artery-utils';

export const immutableNodeState = atom<Immutable.Collection<unknown, unknown>>({
  key: 'immutableNodeState',
  // eslint-disable-next-line new-cap
  default: immutable.Map({}),
});

export const draggingNodeIDState = atom<string | undefined>({
  key: 'draggingNodeIDState',
  default: undefined,
});

export const draggingArteryImmutableNodeState = selector<immutable.Collection<unknown, unknown> | undefined>({
  key: 'draggingArteryImmutableNodeState',
  get: ({ get }) => {
    const draggingNodeID = get(draggingNodeIDState);
    const rootNode = get(immutableNodeState);
    if (!draggingNodeID) {
      return;
    }

    return byArbitrary(rootNode, draggingNodeID) as immutable.Collection<unknown, unknown> | undefined;
  },
});

export const activeContourNodeState = atom<ContourNode | undefined>({
  key: 'activeContourNodeState',
  default: undefined,
});

export const contourNodesState = atom<ContourNode[]>({ key: 'contourNodesState', default: [] });

export const hoveringParentIDState = atom<string>({ key: 'hoveringParentIDState', default: '' });

export const greenZonesBetweenNodesState = atom<GreenZoneBetweenNodes[]>({
  key: 'greenZonesBetweenNodesState',
  default: [],
});

export const contourNodesReport$ = new BehaviorSubject<ContourNodesReport | undefined>(undefined);
export const hoveringContourNode$ = new Subject<ContourNode | undefined>();

export const monitoredElements$ = new BehaviorSubject<Map<HTMLElement, boolean>>(new Map());

function visibleObserverCallback(entries: IntersectionObserverEntry[]): void {
  const monitoredElements = monitoredElements$.value;
  entries.forEach(({ isIntersecting, target }) => {
    monitoredElements.set(target as HTMLElement, isIntersecting);
  });
  monitoredElements$.next(monitoredElements);
}

export const VISIBLE_ELEMENTS_OBSERVER = new IntersectionObserver(visibleObserverCallback);

export const cursor$ = new Subject<Cursor>();

export const latestFocusedGreenZone$ = new BehaviorSubject<GreenZone | undefined>(undefined);

export const onDropEvent$ = new Subject<React.DragEvent>();

export const inDnd$ = new BehaviorSubject<Boolean>(false);
