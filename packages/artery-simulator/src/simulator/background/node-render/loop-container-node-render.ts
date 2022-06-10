import { CTX, LoopContainerNode } from '@one-for-all/artery-renderer';
import React from 'react';

import NodeRender from './index';

interface Props {
  node: LoopContainerNode;
  ctx: CTX;
}

function LoopContainerNodeRender({ node, ctx }: Props): React.ReactElement | null {
  return React.createElement(NodeRender, { node: node.node, ctx });
}

export default LoopContainerNodeRender;
