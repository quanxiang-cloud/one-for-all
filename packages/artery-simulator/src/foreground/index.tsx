import React from 'react';

import RenderContourNode from './render-contour-node';
import { contourNodesReport$ } from '../atoms';
import './index.scss';
// import useHandleDrop from './use-handle-drop';
import { useBehaviorSubjectState } from '../utils';

function Foreground(): JSX.Element {
  const { contourNodes } = useBehaviorSubjectState(contourNodesReport$) || {};

  return (
    <div className="contour-nodes">
      {(contourNodes || []).map((contour) => {
        return (
          <RenderContourNode
            key={`contour-${contour.id}`}
            contourNode={contour}
          />
        );
      })}
    </div>
  );
}

export default Foreground;


