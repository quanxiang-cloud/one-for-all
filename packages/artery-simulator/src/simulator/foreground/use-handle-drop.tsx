import { useEffect } from 'react';
import { Node } from '@one-for-all/artery';
import { latestFocusedGreenZone$, onDropEvent$ } from '../atoms';
import { insertNode, jsonParse, moveNode } from './helper';
import duplicateNode from './toolbar/duplicate-node';
import { filter, map } from 'rxjs';
import { DND_DATA_TRANSFER_TYPE_ARTERY_NODE, DND_DATA_TRANSFER_TYPE_NODE_ID } from '../constants';
import { artery$, immutableRoot$, onChangeArtery } from '../bridge';

interface MoveNodeRequest {
  type: 'move_node_request';
  nodeID: string;
}

interface DropNodeRequest {
  type: 'insert_node_request';
  node: Node;
}

type DropRequest = MoveNodeRequest | DropNodeRequest;

export default function useHandleDrop(): void {
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

  useEffect(() => {
    const artery = artery$.value;
    const rootNode = immutableRoot$.value;

    const subscription = onDropEvent$
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
              rootNode,
              nodeID: dropRequest.nodeID,
              greenZone: latestFocusedGreenZone$.value,
            });
          }

          if (dropRequest.type === 'insert_node_request') {
            return insertNode({ rootNode, node: dropRequest.node, greenZone: latestFocusedGreenZone$.value });
          }
        }),
        map((newRoot) => (newRoot ? newRoot.toJS() : undefined)),
        filter((newRoot) => !!newRoot),
      )
      .subscribe((node) => {
        onChangeArtery({ ...artery, node: node as unknown as Node });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}