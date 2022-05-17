import React, { useMemo } from 'react';
import { Plugins } from '@one-for-all/artery-renderer';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../../types';
import RenderLayer from './render-layer';

import './index.scss';
import { useBehaviorSubjectState } from '../utils';
import { activeOverLayerArtery$ } from '../bridge';

interface Props {
  plugins?: Plugins;
  onModalLayerReport: (report?: ContourNodesReport) => void;
}

const modalLayerContextValue = createLayerContextVal();

function ModalLayerRender({
  plugins,
  onModalLayerReport,
}: Props): JSX.Element | null {
  const modalLayerArtery = useBehaviorSubjectState(activeOverLayerArtery$);

  if (!modalLayerArtery) {
    return null;
  }

  return (
    <SimulatorLayerCtx.Provider value={modalLayerContextValue}>
      <RenderLayer
        artery={modalLayerArtery}
        plugins={plugins}
        onReport={onModalLayerReport}
      />
    </SimulatorLayerCtx.Provider>
  );
}

export default ModalLayerRender;
