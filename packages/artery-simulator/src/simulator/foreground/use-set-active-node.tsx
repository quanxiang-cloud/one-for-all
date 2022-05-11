import { useCallback } from 'react';
import { immutableNodeState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { byArbitrary } from '@one-for-all/artery-utils';
import { setActiveNode } from '../bridge';

export default function useSetActiveNode(): (nodeID: string) => void {
  const rootNode = useRecoilValue(immutableNodeState);

  return useCallback(
    (nodeID: string) => {
      if (!nodeID) {
        setActiveNode(undefined);
        return;
      }

      const keyPath = byArbitrary(rootNode, nodeID);
      if (!keyPath) {
        return;
      }
      // @ts-ignore
      setActiveNode(rootNode.getIn(keyPath)?.toJS());
    },
    [rootNode],
  );
}
