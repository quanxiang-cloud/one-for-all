import React from 'react';
import { Plugins, useBootResult } from '@one-for-all/artery-renderer';
import { Artery } from '@one-for-all/artery';

import NodeRender from './node-render';

interface Props {
  artery: Artery;
  plugins?: Plugins;
}

function Background({ artery, plugins }: Props): JSX.Element | null {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};

  if (!ctx || !rootNode) {
    return null;
  }

  return (
    <div className="simulator-background">
      {/* extra top padding */}
      <div style={{ height: '20px' }} />
      <NodeRender node={rootNode} ctx={ctx} />
      {/* extra bottom padding */}
      <div style={{ height: '20px' }} />
    </div>
  );
}

export default Background;
