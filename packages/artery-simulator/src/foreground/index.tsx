import React from 'react';

import RenderContourNode from './render-contour-node';
import { contourNodesReport$ } from '../atoms';
import './index.scss';
import { useBehaviorSubjectState } from '../utils';
import useHandleDrop from './use-handle-drop';
import Toolbar from './toolbar';

function Foreground(): JSX.Element {
  const { contourNodes } = useBehaviorSubjectState(contourNodesReport$) || {};
  useHandleDrop();

  return (
    <>
      <div className="contour-nodes">
        {(contourNodes || []).map((contour) => {
          return <RenderContourNode key={`contour-${contour.id}`} contourNode={contour} />;
        })}
      </div>
      <Toolbar />
    </>
  );
}

export default Foreground;
