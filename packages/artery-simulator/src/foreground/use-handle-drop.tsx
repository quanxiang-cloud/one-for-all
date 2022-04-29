import { useRecoilState } from 'recoil';
import React, { useCallback, useContext } from 'react';
import { Node } from '@one-for-all/artery';
import { draggingNodeIDState, greenZoneState, immutableNodeState } from '../atoms';
import { dropNode, jsonParse, moveNode } from './helper';
import { ArteryCtx } from '../contexts';

export default function useHandleDrop(): (e: React.DragEvent<HTMLElement>) => void {
  const [draggingNodeID, setDraggingNodeID] = useRecoilState(draggingNodeIDState);
  const [greenZone, setGreenZone] = useRecoilState(greenZoneState);
  const [root] = useRecoilState(immutableNodeState);
  const { onChange, artery } = useContext(ArteryCtx);

  return useCallback((e: React.DragEvent<HTMLElement>) => {
    setDraggingNodeID(undefined);

    if (!greenZone) {
      return;
    }

    let newRoot: Node | undefined;

    // move action
    if (draggingNodeID) {
      newRoot = moveNode({
        root: artery.node,
        draggingNodeID: draggingNodeID,
        hoveringNodeID: greenZone.hoveringNodeID,
        position: greenZone.position,
      });
    } else {
      const droppedNode = jsonParse<Node>(e.dataTransfer.getData('__artery-node'));
      if (droppedNode) {
        // todo drop action
        newRoot = dropNode({
          root: artery.node,
          node: droppedNode,
          hoveringNodeID: greenZone.hoveringNodeID,
          position: greenZone.position,
        });
      }
    }

    if (newRoot) {
      onChange({ ...artery, node: newRoot });
    }

    setGreenZone(undefined);
  }, [draggingNodeID, root, greenZone, artery]);
}
