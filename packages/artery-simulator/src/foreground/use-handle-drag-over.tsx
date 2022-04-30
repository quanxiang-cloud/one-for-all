import { useRecoilState, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { greenZonesBetweenNodesState, immutableNodeState } from '../atoms';
import { ContourNode, Cursor } from '../types';
import { calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty } from '../utils';
import { throttle } from 'lodash';

export default function useHandleDragOver(contourNodes: ContourNode[]): (cursor: Cursor, hoveringContourNode: ContourNode) => void {
  const [immutableRoot] = useRecoilState(immutableNodeState);
  const [hoveringContourNode, setHovering] = useState<ContourNode | undefined>();
  const setGreenZonesBetweenNodes = useSetRecoilState(greenZonesBetweenNodesState);

  const greenZonesBetweenNodes = useMemo(() => {
    if (!hoveringContourNode) {
      return [];
    }
    return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(immutableRoot, hoveringContourNode, contourNodes);

  }, [immutableRoot, contourNodes, hoveringContourNode]);

  const dragOverCallback = useCallback((cursor: Cursor, _hoveringContourNode: ContourNode): void => {
    if (_hoveringContourNode.id !== hoveringContourNode?.id) {
      setHovering(_hoveringContourNode);
    }
  }, []);

  useEffect(() => {
    console.log('greenZonesBetweenNodes', greenZonesBetweenNodes);
    setGreenZonesBetweenNodes(greenZonesBetweenNodes)
  }, [greenZonesBetweenNodes]);

  return throttle(dragOverCallback, 200);
}
