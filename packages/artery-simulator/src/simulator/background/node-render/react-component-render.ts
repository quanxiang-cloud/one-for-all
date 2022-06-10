import React, { useContext } from 'react';
import { useNodeComponent, CTX, ReactComponentNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import useComponentNodeProps from './hooks/use-component-props';
import Placeholder from './placeholder';
import DepthContext from './depth-context';
import HandleNodeRenderErrorBoundary from './error-boundary';
import useNodeBehaviorCheck from './hooks/use-node-behavior-check';
import { _checkIfNodeIsModalLayer, _checkIfNodeSupportChildren } from '../../cache';

interface Props {
  node: ReactComponentNode;
  ctx: CTX;
}

function ReactComponentNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentDepth = useContext(DepthContext) + 1;
  const { nodeProps, wrapperProps } = useComponentNodeProps(node, ctx, currentDepth);
  const nodeComponent = useNodeComponent(node, ctx.plugins);
  const loading = useNodeBehaviorCheck(node);
  const isLayerRoot = currentDepth === 1;

  if (loading || !nodeComponent) {
    return null;
  }

  if (!isLayerRoot && _checkIfNodeIsModalLayer(node)) {
    return null;
  }

  // TODO refactor this
  if (isLayerRoot && _checkIfNodeIsModalLayer(node)) {
    nodeProps.isOpen = true;
    nodeProps.container = 'inside';
  }

  if (!node.children || !node.children.length) {
    return React.createElement(
      HandleNodeRenderErrorBoundary,
      {},
      React.createElement(
        'div',
        wrapperProps,
        React.createElement(
          nodeComponent,
          nodeProps,
          _checkIfNodeSupportChildren(node) ? React.createElement(Placeholder, { parent: node }) : undefined,
        ),
      ),
    );
  }

  return React.createElement(
    DepthContext.Provider,
    { value: currentDepth },
    React.createElement(
      HandleNodeRenderErrorBoundary,
      {},
      React.createElement(
        'div',
        wrapperProps,
        React.createElement(
          nodeComponent,
          nodeProps,
          React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
        ),
      ),
    ),
  );
}

export default ReactComponentNodeRender;
