import React, { useCallback } from 'react';
import type { Artery } from '@one-for-all/artery';
import plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';
import { useBootResult } from '@one-for-all/artery-renderer';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import useElementsRadar from './use-radar-ref';
import NodeRender from './node-render';
import { useBehaviorSubjectState } from '../utils';
import { activeOverLayerArtery$ } from '../bridge';
import { modalLayerContourNodesReport$ } from '../atoms';

import './index.scss';

const modalLayerContextValue = createLayerContextVal();

interface Props {
  artery: Artery;
}

function RenderLayer({ artery }: Props): JSX.Element | null {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};
  const onReport = useCallback((report) => modalLayerContourNodesReport$.next(report), []);
  useElementsRadar(onReport);

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div className="simulator-background-modal-layer">
      <NodeRender node={rootNode} ctx={ctx} />
    </div>
  );
}


function ModalLayerRender(): JSX.Element | null {
  const modalLayerArtery = useBehaviorSubjectState(activeOverLayerArtery$);

  if (!modalLayerArtery) {
    return null;
  }

  return (
    <SimulatorLayerCtx.Provider value={modalLayerContextValue}>
      <RenderLayer artery={modalLayerArtery} />
    </SimulatorLayerCtx.Provider>
  );
}

export default ModalLayerRender;
