import immutable from 'immutable';
import {
  atom,
} from 'recoil';
import { ContourNode, GreenZone } from './types';

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
