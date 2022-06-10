import React, { useCallback, useState } from 'react';
import { useBootResult } from '@one-for-all/artery-renderer';
import plugins from 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS';
import { BehaviorSubject } from 'rxjs';

import NodeRender from './node-render';
import useElementsRadar from './use-radar-ref';
import { artery$ } from '../states-center';
import { useBehaviorSubjectState } from '../utils';
import { contourNodesReport$ } from '../states-center';
import MonitoredElementsContext from './context';

const monitoredElements = new BehaviorSubject<Set<HTMLElement>>(new Set<HTMLElement>());

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
    <MonitoredElementsContext.Provider value={monitoredElements}>
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
    </MonitoredElementsContext.Provider>
  );
}
