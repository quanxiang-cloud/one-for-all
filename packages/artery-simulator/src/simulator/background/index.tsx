import React, { useMemo } from 'react';
import type { ImmutableNode } from '@one-for-all/artery-utils';
import type { Artery, Node } from '@one-for-all/artery';
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

function useModalLayerArtery(artery: Artery, activeModalLayer?: ImmutableNode): Artery | undefined {
  return useMemo<Artery | undefined>(() => {
    if (!activeModalLayer) {
      return;
    }

    const rootModalLayerNode = activeModalLayer.toJS() as unknown as Node;

    return {
      node: rootModalLayerNode,
      apiStateSpec: artery.apiStateSpec,
      sharedStatesSpec: artery.sharedStatesSpec,
    };
  }, [activeModalLayer, artery]);
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
