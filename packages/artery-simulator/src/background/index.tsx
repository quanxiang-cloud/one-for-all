import React, { useMemo } from 'react';
import type { ImmutableNode } from '@one-for-all/artery-utils';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../types';
import RenderLayer from './render-layer';
import ModalLayerRender from './modal-layer-render';

import './index.scss';

interface Props {
  artery: Artery;
  plugins?: Plugins;
  activeModalLayer?: ImmutableNode;
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

    return { node: rootModalLayerNode, apiStateSpec: artery.apiStateSpec, sharedStatesSpec: artery.sharedStatesSpec };
  }, [activeModalLayer, artery]);
}

const rootSimulatorLayerCtxValue = createLayerContextVal();

function Background({ artery, plugins, rootElement, onReport, activeModalLayer, onModalLayerReport }: Props): JSX.Element | null {

  return (
    <>
      <SimulatorLayerCtx.Provider value={rootSimulatorLayerCtxValue}>
        <RenderLayer
          artery={artery}
          plugins={plugins}
          rootElement={rootElement}
          onReport={onReport}
        />
      </SimulatorLayerCtx.Provider>
      <ModalLayerRender
        activeModalLayer={activeModalLayer}
        artery={artery}
        plugins={plugins}
        rootElement={rootElement}
        onModalLayerReport={onModalLayerReport}
      />
    </>
  );
}

export default Background;
