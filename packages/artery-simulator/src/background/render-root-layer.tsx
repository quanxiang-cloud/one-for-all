import React from 'react';
import { Plugins, useBootResult } from '@one-for-all/artery-renderer';
import { Artery } from '@one-for-all/artery';
import NodeRender from './node-render';
import useElementsRadar from './use-radar-ref';
import { ContourNodesReport } from '../types';

type RenderRootLayerProps = {
  artery: Artery;
  plugins?: Plugins;
  rootElement: HTMLElement;
  onReport: (report?: ContourNodesReport) => void;
};

export default function RenderRootLayer({ artery, plugins, rootElement, onReport }: RenderRootLayerProps): JSX.Element | null {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};
  useElementsRadar(rootElement, onReport);

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div className="simulator-background simulator-background--root">
      {/* extra top padding */}
      <div style={{ height: '20px' }} />
      <NodeRender node={rootNode} ctx={ctx} />
      {/* extra bottom padding */}
      <div style={{ height: '20px' }} />
    </div>
  );
}
