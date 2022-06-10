import React from 'react';

import RenderContourNode from './render-contour-node';
import Toolbar from './toolbar';
import FallbackContourNode from './fallback-contour';
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
  const hideFallbackContour = useBehaviorSubjectState(activeOverLayerNodeID$);

  return (
    <>
      <div className="contour-nodes">
        {contourNodes.map((contour) => {
          return <RenderContourNode key={`contour-${contour.id}`} contourNode={contour} />;
        })}
      </div>
      {!hideFallbackContour && (<FallbackContourNode />)}
      <Toolbar />
    </>
  );
}

export default Foreground;
