import React, { useMemo } from 'react';
import { Plugins } from '@one-for-all/artery-renderer';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../../types';
import RenderLayer from './render-layer';

import './index.scss';
import { useBehaviorSubjectState } from '../utils';
import { activeOverLayerArtery$, artery$ } from '../bridge';

interface Props {
  plugins?: Plugins;
  rootElement: HTMLElement;
  onModalLayerReport: (report?: ContourNodesReport) => void;
}

function ModalLayerRender({
  plugins,
  rootElement,
  onModalLayerReport,
}: Props): JSX.Element | null {
  const modalLayerArtery = useBehaviorSubjectState(activeOverLayerArtery$);
  const modalLayerContextValue = useMemo(() => createLayerContextVal(), []);

  if (!modalLayerArtery) {
    return null;
  }

  return (
    <SimulatorLayerCtx.Provider value={modalLayerContextValue}>
      <RenderLayer
        artery={modalLayerArtery}
        plugins={plugins}
        rootElement={rootElement}
        onReport={onModalLayerReport}
      />
    </SimulatorLayerCtx.Provider>
  );
}

export default ModalLayerRender;
