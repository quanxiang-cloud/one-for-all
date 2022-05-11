import { useMemo } from 'react';
import { contourNodesReport$ } from '../../atoms';
import { useBehaviorSubjectState } from '../../utils';
import { ContourNode } from '../../../types';
import { useActiveNode } from '../../bridge';

export function useActiveContour(): ContourNode | undefined {
  const activeNode = useActiveNode();
  const report = useBehaviorSubjectState(contourNodesReport$);

  return useMemo(() => {
    if (!report) {
      return;
    }

    return report.contourNodes.find(({ id }) => id === activeNode?.id);
  }, [activeNode, report]);
}
