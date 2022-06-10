import { useEffect, useState } from 'react';
import { fromJS } from 'immutable';
import { BehaviorSubject, Subject, map, Observable, distinctUntilChanged, combineLatest, filter } from 'rxjs';
import { byArbitrary, ImmutableNode } from '@one-for-all/artery-utils';
import type { Artery, Node } from '@one-for-all/artery';

import { ContourNode, Cursor, DropRequest, GreenZone } from '../types';
import { DUMMY_ARTERY_ROOT_NODE_ID } from './constants';
import { getDropRequest, insertNode, jsonParse, moveNode } from './utils';

export const contourNodesReport$ = new BehaviorSubject<ContourNode[] | undefined>(undefined);
export const cursor$ = new Subject<Cursor>();
export const draggingArteryImmutableNode$ = new BehaviorSubject<ImmutableNode | undefined>(undefined);
export const draggingNodeID$ = new BehaviorSubject<string>('');
export const hoveringContourNode$ = new Subject<ContourNode | undefined>();
export const hoveringParentID$ = new BehaviorSubject('');
export const inDnd$ = new BehaviorSubject<boolean>(false);
export const latestFocusedGreenZone$ = new BehaviorSubject<GreenZone | undefined>(undefined);
export const modalLayerContourNodesReport$ = new BehaviorSubject<ContourNode[] | undefined>(undefined);
export const onDropEvent$ = new Subject<React.DragEvent>();

const dummyArtery: Artery = {
  node: { id: DUMMY_ARTERY_ROOT_NODE_ID, type: 'html-element', name: 'div' },
};

export const immutableRoot$ = new BehaviorSubject<ImmutableNode>(
  fromJS({ id: 'initial', type: 'html', nam: 'div' }),
);
export const artery$ = new BehaviorSubject<Artery>(dummyArtery);
export const activeNode$ = new BehaviorSubject<Node | undefined>(undefined);
export const activeContour$ = new BehaviorSubject<ContourNode | undefined>(undefined);
export const activeOverLayerNodeID$ = new BehaviorSubject<string | undefined>(undefined);
export const activeContourToolbarStyle$ = new BehaviorSubject<React.CSSProperties | undefined>(undefined);
export const activeOverLayerArtery$ = new BehaviorSubject<Artery | undefined>(undefined);
export const rootNodID$: Observable<string> = immutableRoot$.pipe(
  map((node) => node.getIn(['id']) as string),
  distinctUntilChanged(),
);

export const dropResult$ = onDropEvent$.pipe(
  filter(() => !!latestFocusedGreenZone$.value),
  map((e) => getDropRequest(e.dataTransfer)),
  filter((request): request is DropRequest => !!request),
  map((dropRequest) => {
    if (!latestFocusedGreenZone$.value) {
      return;
    }

    if (dropRequest.type === 'move_node_request') {
      return moveNode({
        rootNode: immutableRoot$.value,
        nodeID: dropRequest.nodeID,
        greenZone: latestFocusedGreenZone$.value,
      });
    }

    if (dropRequest.type === 'insert_node_request') {
      return insertNode({
        rootNode: immutableRoot$.value,
        node: dropRequest.node,
        greenZone: latestFocusedGreenZone$.value,
      });
    }
  }),
  map((newRoot) => (newRoot ? newRoot.toJS() : undefined)),
  filter((newRoot) => !!newRoot),
);

export function useArteryRootNodeID(): string {
  const [rootNodeID, setRootNodeID] = useState('');
  useEffect(() => {
    const subscription = rootNodID$.subscribe(setRootNodeID);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return rootNodeID;
}

artery$.pipe(map<Artery, ImmutableNode>((artery) => fromJS(artery.node))).subscribe(immutableRoot$);

draggingNodeID$
  .pipe(
    map((draggingNodeID) => {
      if (!draggingNodeID) {
        return undefined;
      }

      return byArbitrary(immutableRoot$.value, draggingNodeID) as ImmutableNode | undefined;
    }),
  )
  .subscribe(draggingArteryImmutableNode$);

activeOverLayerNodeID$
  .pipe(
    map((activeModalRootID) => {
      if (!activeModalRootID) {
        return undefined;
      }

      const keyPath = byArbitrary(immutableRoot$.value, activeModalRootID);
      if (!keyPath) {
        return undefined;
      }

      const _node = immutableRoot$.value.getIn(keyPath) as ImmutableNode;

      return _node.toJS() as unknown as Node;
    }),
    map((node) => {
      if (!node) {
        return undefined;
      }

      return {
        node,
        apiStateSpec: artery$.value.apiStateSpec,
        sharedStatesSpec: artery$.value.sharedStatesSpec,
      };
    }),
  )
  .subscribe(activeOverLayerArtery$);

combineLatest({
  activeNode: activeNode$,
  contourNodesReport: contourNodesReport$,
  modalLayerContourNodesReport: modalLayerContourNodesReport$,
  activeOverLayerNodeID: activeOverLayerNodeID$,
})
  .pipe(
    map(({ activeNode, contourNodesReport, modalLayerContourNodesReport, activeOverLayerNodeID }) => {
      if (activeOverLayerNodeID) {
        return modalLayerContourNodesReport?.find(({ id }) => id === activeNode?.id);
      }

      return contourNodesReport?.find(({ id }) => id === activeNode?.id);
    }),
    distinctUntilChanged((p, c) => p?.id === c?.id),
  )
  .subscribe(activeContour$);

activeContour$
  .pipe(
    filter((n): n is ContourNode => !!n),
    map(({ absolutePosition, relativeRect }) => {
      const { x, y, height } = absolutePosition;

      if (relativeRect?.y < 40) {
        return {
          transform: `translate(${x + 4}px, ${y + height}px)`,
        };
      }

      return {
        transform: `translate(${x + 4}px, ${y}px)`,
      };
    }),
  )
  .subscribe(activeContourToolbarStyle$);
