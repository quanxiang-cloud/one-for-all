import React, { useCallback } from 'react';
import type { Artery } from '@one-for-all/artery';
import { useBootResult } from '@one-for-all/artery-renderer';
import plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';
import { BehaviorSubject } from 'rxjs';

import useElementsRadar from './use-radar-ref';
import NodeRender from './node-render';
import { useBehaviorSubjectState } from '../utils';
import { activeOverLayerArtery$ } from '../bridge';
import { modalLayerContourNodesReport$ } from '../atoms';
import MonitoredElementsContext from './context';

const monitoredElements = new BehaviorSubject<Set<HTMLElement>>(new Set<HTMLElement>());

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
    <div className="simulator-background-layer">
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
    <MonitoredElementsContext.Provider value={monitoredElements}>
      <RenderLayer artery={modalLayerArtery} />
    </MonitoredElementsContext.Provider>
  );
}

export default ModalLayerRender;
