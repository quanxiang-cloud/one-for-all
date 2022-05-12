import type { Node } from '@one-for-all/artery';
import { BehaviorSubject, Subject, filter, map } from 'rxjs';
import immutable from 'immutable';
import { atom, selector } from 'recoil';
import { ContourNode, GreenZoneBetweenNodes, ContourNodesReport, Cursor, GreenZone } from '../types';
import { byArbitrary } from '@one-for-all/artery-utils';
import { artery$, immutableRoot$, onChangeArtery } from './bridge';
import { DND_DATA_TRANSFER_TYPE_ARTERY_NODE, DND_DATA_TRANSFER_TYPE_NODE_ID } from './constants';
import { insertNode, jsonParse, moveNode } from './foreground/helper';
import duplicateNode from './foreground/toolbar/duplicate-node';

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

export const inDnd$ = new BehaviorSubject<boolean>(false);

export const onDropEvent$ = new Subject<React.DragEvent>();

interface MoveNodeRequest {
  type: 'move_node_request';
  nodeID: string;
}

interface DropNodeRequest {
  type: 'insert_node_request';
  node: Node;
}

type DropRequest = MoveNodeRequest | DropNodeRequest;

function getDropRequest(dataTransfer: DataTransfer): DropRequest | undefined {
  const draggingNodeID = dataTransfer.getData(DND_DATA_TRANSFER_TYPE_NODE_ID);
  if (draggingNodeID) {
    return { type: 'move_node_request', nodeID: draggingNodeID };
  }

  const droppedNode = jsonParse<Node>(dataTransfer.getData(DND_DATA_TRANSFER_TYPE_ARTERY_NODE));
  if (droppedNode) {
    return { type: 'insert_node_request', node: duplicateNode(droppedNode) };
  }

  return;
}

onDropEvent$
  .pipe(
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
        return insertNode({ rootNode:immutableRoot$.value, node: dropRequest.node, greenZone: latestFocusedGreenZone$.value });
      }
    }),
    map((newRoot) => (newRoot ? newRoot.toJS() : undefined)),
    filter((newRoot) => !!newRoot),
  )
  .subscribe((node) => {
    onChangeArtery({ ...artery$.value, node: node as unknown as Node });
  });


