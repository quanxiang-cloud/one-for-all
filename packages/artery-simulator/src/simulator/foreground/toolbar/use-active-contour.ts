import { useMemo } from 'react';
import { contourNodesReport$ } from '../../atoms';
import { useBehaviorSubjectState } from '../../utils';
import { ContourNode } from '../../../types';
import { activeNode$ } from '../../bridge';

export function useActiveContour(): ContourNode | undefined {
  const activeNode = useBehaviorSubjectState(activeNode$);
  const report = useBehaviorSubjectState(contourNodesReport$);

  return useMemo(() => {
    if (!report) {
      return;
    }

    return report.contourNodes.find(({ id }) => id === activeNode?.id);
  }, [activeNode, report]);
}
