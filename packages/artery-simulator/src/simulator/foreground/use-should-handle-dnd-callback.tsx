import { byArbitrary } from '@one-for-all/artery-utils';
import { useCallback, useRef } from 'react';
import { draggingArteryImmutableNode$, draggingNodeID$ } from '../atoms';
import { useBehaviorSubjectState } from '../utils';

export default function useShouldHandleDndCallback(currentID: string): (e: React.DragEvent) => boolean {
  const isDraggingParent = useRef<boolean | undefined>();
  const draggingNodeID = useBehaviorSubjectState(draggingNodeID$);
  const draggingNode = useBehaviorSubjectState(draggingArteryImmutableNode$);

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
    [draggingNodeID, draggingNode],
  );
}
