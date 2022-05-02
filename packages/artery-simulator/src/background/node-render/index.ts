import React, { useContext } from 'react';
import { ArteryNode, CTX } from '@one-for-all/artery-renderer';

import HTMLNodeRender from './html-node-render';
import ReactComponentNodeRender from './react-component-render';
import { logger } from '@one-for-all/utils';
import ComposeNodeRender from './compose-node-render';
import LoopContainerNodeRender from './loop-container-node-render';
import DepthContext from './depth-context';

interface Props {
  node: ArteryNode;
  ctx: CTX;
}

function NodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentDepth = useContext(DepthContext) + 1;
  // todo support render this kind of node
  if (node.type === 'route-node' || node.type === 'jsx-node' || node.type === 'ref-node') {
    logger.debug('simulator skip render unsupported node:', node);
    return null;
  }

  if (node.type === 'html-element') {
    return React.createElement(
      DepthContext.Provider,
      { value: currentDepth },
      React.createElement(HTMLNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'react-component') {
    return React.createElement(
      DepthContext.Provider,
      { value: currentDepth },
      React.createElement(ReactComponentNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'composed-node') {
    return React.createElement(ComposeNodeRender, { node, ctx });
  }

  if (node.type === 'loop-container') {
    return React.createElement(LoopContainerNodeRender, { node, ctx });
  }

  return null;
}

export default NodeRender;
