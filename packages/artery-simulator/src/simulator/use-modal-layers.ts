import { filter, ImmutableNode } from '@one-for-all/artery-utils';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { immutableNodeState } from './atoms';
import { modalLayerNodeExecutors$ } from './cache';
import { getNodeExecutor, useBehaviorSubjectState } from './utils';

export default function useModalLayers(): Array<ImmutableNode> {
  const executors = useBehaviorSubjectState(modalLayerNodeExecutors$);
  const [modalLayers, setModalLayers] = useState<Array<ImmutableNode>>([]);
  const rootNode = useRecoilValue(immutableNodeState);

  useEffect(() => {
    const keyPathList = filter(rootNode, (currentNode) => {
      const nodeType = currentNode.getIn(['type']);
      if (nodeType === 'html-element') {
        executors.has(getNodeExecutor({ type: 'html-element', name: currentNode.getIn(['name']) as string }));
      }

      if (nodeType === 'react-component') {
        return executors.has(
          getNodeExecutor({
            type: 'react-component',
            packageName: currentNode.getIn(['packageName']) as string,
            packageVersion: currentNode.getIn(['packageVersion']) as string,
            exportName: currentNode.getIn(['exportName']) as string,
          }),
        );
      }

      return false;
    });

    if (!keyPathList.size) {
      setModalLayers([]);
      return;
    }

    setModalLayers(
      keyPathList.map<ImmutableNode>((keyPath) => rootNode.getIn(keyPath) as ImmutableNode).toArray(),
    );
  }, [executors, rootNode]);

  return modalLayers;
}
