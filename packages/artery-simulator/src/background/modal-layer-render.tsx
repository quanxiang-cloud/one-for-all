import React, { useMemo } from 'react';
import type { ImmutableNode } from '@one-for-all/artery-utils';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../types';
import RenderLayer from './render-layer';

import './index.scss';

interface Props {
  artery: Artery;
  plugins?: Plugins;
  activeModalLayer?: ImmutableNode;
  rootElement: HTMLElement;
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

function ModalLayerRender({ artery, plugins, rootElement, activeModalLayer, onModalLayerReport }: Props): JSX.Element | null {
  const modalLayerArtery = useModalLayerArtery(artery, activeModalLayer);
  const modalLayerContextValue = useMemo(() => createLayerContextVal(), []);

  if (!modalLayerArtery) {
    return null;
  }

  return (
    <SimulatorLayerCtx.Provider value={modalLayerContextValue} >
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
