import { useContext, useMemo } from 'react';
import { contourNodesReport$ } from '../../atoms';
import { ArteryCtx } from '../../contexts';
import { useBehaviorSubjectState } from '../../utils';
import { ContourNode } from '../../types';

export function useActiveContour(): ContourNode | undefined {
  const { activeNode } = useContext(ArteryCtx);
  const report = useBehaviorSubjectState(contourNodesReport$);

  return useMemo(() => {
    if (!report) {
      return;
    }

    return report.contourNodes.find(({ id }) => id === activeNode?.id);
  }, [activeNode, report]);
}
