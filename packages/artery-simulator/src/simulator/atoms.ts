import { BehaviorSubject, Subject } from 'rxjs';
import immutable from 'immutable';
import { atom, selector } from 'recoil';
import { ContourNode, GreenZoneBetweenNodes, ContourNodesReport, Cursor, GreenZone } from '../types';
import { byArbitrary } from '@one-for-all/artery-utils';
import { immutableRoot$ } from './bridge';

export const draggingNodeIDState = atom<string | undefined>({
  key: 'draggingNodeIDState',
  default: undefined,
});

export const draggingArteryImmutableNodeState = selector<immutable.Collection<unknown, unknown> | undefined>({
  key: 'draggingArteryImmutableNodeState',
  get: ({ get }) => {
    const draggingNodeID = get(draggingNodeIDState);
    if (!draggingNodeID) {
      return;
    }

    return byArbitrary(immutableRoot$.value, draggingNodeID) as
      | immutable.Collection<unknown, unknown>
      | undefined;
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
export const modalLayerContourNodesReport$ = new BehaviorSubject<ContourNodesReport | undefined>(undefined);
export const hoveringContourNode$ = new Subject<ContourNode | undefined>();

export const cursor$ = new Subject<Cursor>();

export const latestFocusedGreenZone$ = new BehaviorSubject<GreenZone | undefined>(undefined);

export const onDropEvent$ = new Subject<React.DragEvent>();

export const inDnd$ = new BehaviorSubject<boolean>(false);
