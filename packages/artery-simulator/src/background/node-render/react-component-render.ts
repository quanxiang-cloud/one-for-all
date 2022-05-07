import React, { useContext } from 'react';
import { useNodeComponent, CTX, ReactComponentNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import useComponentNodeProps from './hooks/use-component-props';
import Placeholder from './placeholder';
import { useSupportChildrenCheck } from './use-support-children-check';
import DepthContext from './depth-context';
import ErrorBoundary from './error-boundary';
import useShouldRenderChildrenPlaceholder from './use-should-render-children-placeholder';

interface Props {
  node: ReactComponentNode;
  ctx: CTX;
}

function ReactComponentNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentDepth = useContext(DepthContext) + 1;
  const { nodeProps, wrapperProps } = useComponentNodeProps(node, ctx, currentDepth);
  const nodeComponent = useNodeComponent(node, ctx.plugins);
  // todo combine useSupportChildrenCheck and shouldRenderPlaceholder
  useSupportChildrenCheck(node);
  const shouldRenderPlaceholder = useShouldRenderChildrenPlaceholder(node);

  if (!nodeComponent) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(
      ErrorBoundary,
      {},
      React.createElement(
        'div',
        wrapperProps,
        React.createElement(
          nodeComponent,
          nodeProps,
          shouldRenderPlaceholder ? React.createElement(Placeholder, { parent: node }) : undefined
        ),
      ),
    );
  }

  return React.createElement(
    DepthContext.Provider,
    { value: currentDepth },
    React.createElement(
      ErrorBoundary,
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
