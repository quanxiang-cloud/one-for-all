import React, { useCallback, useState } from 'react';
import { useBootResult } from '@one-for-all/artery-renderer';
import plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';

import NodeRender from './node-render';
import useElementsRadar from './use-radar-ref';
import { artery$ } from '../bridge';
import { useBehaviorSubjectState } from '../utils';
import { contourNodesReport$ } from '../atoms';
import SimulatorLayerCtx, { createLayerContextVal } from './context';

const rootSimulatorLayerCtxValue = createLayerContextVal();

interface Props {
  rootElement: HTMLElement;
}

function RenderLayer({ rootElement }: Props): JSX.Element | null {
  const artery = useBehaviorSubjectState(artery$);
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};
  const onReport = useCallback((report) => contourNodesReport$.next(report), []);
  useElementsRadar(onReport, rootElement);

  if (!ctx || !rootNode) {
    return null;
  }

  return <NodeRender node={rootNode} ctx={ctx} />;
}

export default function RootLayerRenderLayer(): JSX.Element | null {
  const [rootElement, setRootElement] = useState<HTMLDivElement>();

  return (
    <SimulatorLayerCtx.Provider value={rootSimulatorLayerCtxValue}>
      <div
        className="simulator-background-layer"
        ref={(ref) => {
          if (ref) {
            setRootElement(ref);
          }
        }}
      >
        {rootElement && <RenderLayer rootElement={rootElement} />}
      </div>
    </SimulatorLayerCtx.Provider>
  );
}
