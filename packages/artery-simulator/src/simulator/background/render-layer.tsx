import React from 'react';
import { Plugins, useBootResult } from '@one-for-all/artery-renderer';
import NodeRender from './node-render';
import useElementsRadar from './use-radar-ref';
import { Artery } from '@one-for-all/artery';
import { ContourNodesReport } from '../../types';

interface Props {
  artery: Artery;
  plugins?: Plugins;
  rootElement: HTMLElement;
  onReport: (report?: ContourNodesReport) => void;
}

export default function RenderLayer({ artery, plugins, rootElement, onReport }: Props): JSX.Element | null {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};
  useElementsRadar(rootElement, onReport);

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div className="simulator-background simulator-background--root">
      {/* extra top padding */}
      <div style={{ height: '20px' }} />
      <NodeRender node={rootNode} ctx={ctx} isLayerRoot={true} />
      {/* extra bottom padding */}
      <div style={{ height: '20px' }} />
    </div>
  );
}
