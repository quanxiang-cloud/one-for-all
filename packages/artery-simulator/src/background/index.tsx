import React, { useRef, useEffect } from 'react';
import { Plugins, useBootResult } from '@one-for-all/artery-renderer';
import { Artery } from '@one-for-all/artery';

import NodeRender from './node-render';
import useVisibleObserver from './use-visible-observer';
import { VisibleObserverCTX } from './contexts';
import type { SimulatorReport } from '../types';

interface Props {
  artery: Artery;
  plugins?: Plugins;
  onReport: (report: SimulatorReport) => void;
  scrollPosition: { x: number; y: number };
}

function Background({ artery, plugins, onReport, scrollPosition }: Props): JSX.Element | null {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};
  const backgroundRef = useRef<HTMLDivElement>(null);
  const visibleObserver = useVisibleObserver(onReport, backgroundRef.current);

  useEffect(() => {
    if (!backgroundRef.current) {
      return;
    }

    backgroundRef.current.scrollLeft = scrollPosition.x;
    backgroundRef.current.scrollTop = scrollPosition.y;
  }, [scrollPosition]);

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div ref={backgroundRef} className="simulator-background">
      <VisibleObserverCTX.Provider value={visibleObserver}>
        <NodeRender node={rootNode} ctx={ctx} />
      </VisibleObserverCTX.Provider>
    </div>
  );
}

export default Background;
