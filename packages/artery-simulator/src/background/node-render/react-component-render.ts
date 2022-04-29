import React from 'react';
import { useNodeComponent, CTX, ReactComponentNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import useComponentNodeProps from './hooks/use-component-props';
import Placeholder from './placeholder';
import { useSupportChildrenCheck } from './use-support-children-check';

interface Props {
  node: ReactComponentNode;
  ctx: CTX;
}

function ReactComponentNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const { nodeProps, wrapperProps } = useComponentNodeProps(node, ctx);
  const nodeComponent = useNodeComponent(node, ctx.plugins);
  useSupportChildrenCheck(node);

  if (!nodeComponent) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(
      'div',
      wrapperProps,
      React.createElement(nodeComponent, nodeProps, React.createElement(Placeholder, { parent: node })),
    );
  }

  return React.createElement(
    'div',
    wrapperProps,
    React.createElement(
      nodeComponent,
      nodeProps,
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    ),
  );
}

export default ReactComponentNodeRender;
