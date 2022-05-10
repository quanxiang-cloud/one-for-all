import { byArbitrary } from '@one-for-all/artery-utils';
import { useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { draggingArteryImmutableNodeState, draggingNodeIDState, immutableNodeState } from '../atoms';

export default function useShouldHandleDndCallback(currentID: string): (e: React.DragEvent) => boolean {
  const isDraggingParent = useRef<boolean | undefined>();
  const rootNode = useRecoilValue(immutableNodeState);
  const draggingNodeID = useRecoilValue(draggingNodeIDState);
  const draggingNode = useRecoilValue(draggingArteryImmutableNodeState);

  return useCallback(
    (e: React.DragEvent) => {
      if (e.dataTransfer.types.includes('artery_node')) {
        return true;
      }

      if (!draggingNodeID || !draggingNode) {
        return false;
      }

      if (draggingNodeID === currentID) {
        return false;
      }

      if (isDraggingParent.current === undefined) {
        isDraggingParent.current = !!byArbitrary(draggingNode, currentID);
      }

      return !isDraggingParent.current;
    },
    [rootNode, draggingNodeID, draggingNode],
  );
}
