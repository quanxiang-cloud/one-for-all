import { useRecoilState, useSetRecoilState } from 'recoil';
import React, { useCallback, useEffect, useRef } from 'react';

import RenderContourNode from './render-contour-node';
import { contourNodesState, greenZoneState, isScrollingState } from '../atoms';
import type { ContourNode, Cursor, GreenZone, Position, SimulatorReport } from '../types';
import { useContourNodes } from './use-contour-nodes';
import { throttle } from 'lodash';
import { calcHoverPosition, getIsNodeSupportCache } from '../utils';
import './index.scss';
import useHandleDrop from './use-handle-drop';

interface Props {
  report: SimulatorReport;
}

function useHandleDragOver(): (cursor: Cursor, hoveringContourNode: ContourNode) => void {
  const positionRef = useRef<Position>();
  const [greenZone, setGreenZone] = useRecoilState(greenZoneState);
  const greenZoneRef = useRef<GreenZone>();

  useCallback(() => {

  }, [])

  function optimizedSetGreenZone(newZone?: GreenZone): void {
    if (newZone?.hoveringNodeID !== greenZone?.hoveringNodeID || newZone?.position !== greenZone?.position) {
      setGreenZone(newZone);
    }
  }

  const handleDragOver = throttle((cursor: Cursor, hoveringContourNode: ContourNode) => {
    const position = calcHoverPosition({
      cursor,
      hoveringRect: hoveringContourNode.raw,
      supportInner: !!getIsNodeSupportCache(hoveringContourNode.executor),
    });

    if (positionRef.current !== position) {
      positionRef.current = position;
      optimizedSetGreenZone({ position, hoveringNodeID: hoveringContourNode.id, mostInnerNode: hoveringContourNode });
    }
  }, 200);

  return handleDragOver;
}

function Foreground({ report }: Props): JSX.Element {
  const [isScrolling] = useRecoilState(isScrollingState);
  const contourNodes = useContourNodes(report.visibleNodes, isScrolling);
  const setContourNodesState = useSetRecoilState(contourNodesState);
  const handleDrop = useHandleDrop();
  const handleDragOver = useHandleDragOver();

  useEffect(() => {
    setContourNodesState(contourNodes);
  }, [contourNodes]);

  return (
    <div className="contour-nodes">
      {contourNodes.map((contour) => {
        return (
          <RenderContourNode
            key={`contour-${contour.id}`}
            contourNode={contour}
            handleDragOver={(e) => handleDragOver({ x: e.clientX, y: e.clientY }, contour)}
            handleDrop={handleDrop}
          />
        );
      })}
    </div>
  );
}

export default Foreground;


