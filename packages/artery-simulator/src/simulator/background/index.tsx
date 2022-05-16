import React from 'react';
import Plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../../types';
import RenderLayer from './render-layer';
import ModalLayerRender from './modal-layer-render';

import './index.scss';

interface Props {
  rootElement: HTMLElement;
  onReport: (report?: ContourNodesReport) => void;
  onModalLayerReport: (report?: ContourNodesReport) => void;
}

const rootSimulatorLayerCtxValue = createLayerContextVal();

function Background({
  rootElement,
  onReport,
  onModalLayerReport,
}: Props): JSX.Element | null {
  return (
    <>
      <SimulatorLayerCtx.Provider value={rootSimulatorLayerCtxValue}>
        <RenderLayer plugins={Plugins} rootElement={rootElement} onReport={onReport} />
      </SimulatorLayerCtx.Provider>
      <ModalLayerRender
        plugins={Plugins}
        rootElement={rootElement}
        onModalLayerReport={onModalLayerReport}
      />
    </>
  );
}

export default Background;
