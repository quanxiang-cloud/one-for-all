import React from 'react';
import Plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import RenderLayer from './render-layer';
import ModalLayerRender from './modal-layer-render';

import './index.scss';
import { contourNodesReport$, modalLayerContourNodesReport$ } from '../atoms';

const rootSimulatorLayerCtxValue = createLayerContextVal();

function Background(): JSX.Element | null {
  return (
    <>
      <SimulatorLayerCtx.Provider value={rootSimulatorLayerCtxValue}>
        <RenderLayer plugins={Plugins} onReport={(report) => contourNodesReport$.next(report)} />
      </SimulatorLayerCtx.Provider>
      <ModalLayerRender
        plugins={Plugins}
        onModalLayerReport={(report) => modalLayerContourNodesReport$.next(report)}
      />
    </>
  );
}

export default Background;
