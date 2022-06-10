import { ArteryNode, CTX } from '@one-for-all/artery-renderer';
import React from 'react';

import NodeRender from './index';

interface ChildrenRenderProps {
  nodes: ArteryNode[];
  ctx: CTX;
}

function ChildrenRender({ nodes, ctx }: ChildrenRenderProps): React.ReactElement | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    // why concat index on element key?
    // https://reactjs.org/docs/reconciliation.html#recursing-on-children
    // we depended on node mount/unmount to update monitoredElements$,
    // add index to node key to force it re-render
    nodes.map((node, i) => React.createElement(NodeRender, { key: `${node.id}-${i}`, node: node, ctx })),
  );
}

export default ChildrenRender;
