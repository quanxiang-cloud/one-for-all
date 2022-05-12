import { useCallback } from 'react';
import { byArbitrary } from '@one-for-all/artery-utils';
import { immutableRoot$, setActiveNode } from '../bridge';

export default function useSetActiveNode(): (nodeID: string) => void {
  return useCallback(
    (nodeID: string) => {
      if (!nodeID) {
        setActiveNode(undefined);
        return;
      }

      const keyPath = byArbitrary(immutableRoot$.value, nodeID);
      if (!keyPath) {
        return;
      }
      // @ts-ignore
      setActiveNode(rootNode.getIn(keyPath)?.toJS());
    },
    [],
  );
}
