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
    nodes.map((node) => React.createElement(NodeRender, { key: node.id, node: node, ctx })),
  );
}

export default ChildrenRender;
