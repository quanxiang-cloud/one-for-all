import { useRecoilState, useSetRecoilState } from 'recoil';
import React, { useEffect } from 'react';

import RenderContourNode from './render-contour-node';
import { contourNodesState, isScrollingState } from '../atoms';
import type { SimulatorReport } from '../types';
import { useContourNodes } from './use-contour-nodes';
import './index.scss';
import useHandleDrop from './use-handle-drop';
import useHandleDragOver from './use-handle-drag-over';

interface Props {
  report: SimulatorReport;
}

function Foreground({ report }: Props): JSX.Element {
  const [isScrolling] = useRecoilState(isScrollingState);
  const contourNodes = useContourNodes(report.visibleNodes, isScrolling);
  const setContourNodesState = useSetRecoilState(contourNodesState);
  const handleDrop = useHandleDrop();
  const handleDragOver = useHandleDragOver(contourNodes);

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


