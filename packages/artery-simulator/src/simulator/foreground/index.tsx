import React, { useEffect, useState } from 'react';

import RenderContourNode from './render-contour-node';
import { contourNodesReport$, modalLayerContourNodesReport$ } from '../atoms';
import './index.scss';
import { useBehaviorSubjectState } from '../utils';
import Toolbar from './toolbar';
import { activeOverLayerNodeID$ } from '../bridge';
import { ContourNode } from 'src/types';

function useContourNodes(): Array<ContourNode> {
  const { contourNodes } = useBehaviorSubjectState(contourNodesReport$) || {};
  const { contourNodes: modalLayerContourNodes } = useBehaviorSubjectState(modalLayerContourNodesReport$) || {};
  const activeOverLayerNodeID = useBehaviorSubjectState(activeOverLayerNodeID$);

  if (activeOverLayerNodeID) {
    return modalLayerContourNodes || [];
  }

  return contourNodes || [];
}

function Foreground(): JSX.Element {
  const contourNodes = useContourNodes();

  return (
    <>
      <div className="contour-nodes">
        {contourNodes.map((contour) => {
          return <RenderContourNode key={`contour-${contour.id}`} contourNode={contour} />;
        })}
      </div>
      <Toolbar />
    </>
  );
}

export default Foreground;
