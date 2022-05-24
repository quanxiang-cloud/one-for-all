import React from 'react';

import RenderContourNode from './render-contour-node';
import Toolbar from './toolbar';
import type { ContourNode } from '../../types';
import { activeOverLayerNodeID$, contourNodesReport$, modalLayerContourNodesReport$ } from '../states-center';
import { useBehaviorSubjectState } from '../utils';

import './index.scss';

function useContourNodes(): Array<ContourNode> {
  const contourNodes = useBehaviorSubjectState(contourNodesReport$) || [];
  const modalLayerContourNodes = useBehaviorSubjectState(modalLayerContourNodesReport$) || [];
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
