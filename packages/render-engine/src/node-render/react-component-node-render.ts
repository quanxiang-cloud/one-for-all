import React from 'react';

import useInstantiateProps from '../use-instantiate-props';
import { ChildrenRender } from './index';
import type { CTX, ReactComponentNode } from '../types';
import { useLifecycleHook } from './hooks';
import useNodeComponent from './hooks/use-node-component';

interface Props {
  node: ReactComponentNode;
  ctx: CTX;
}

function ReactComponentNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const props = useInstantiateProps(node, ctx);
  const nodeComponent = useNodeComponent(node, ctx.plugins);
  useLifecycleHook(node.lifecycleHooks || {});

  if (!nodeComponent) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(nodeComponent, props);
  }

  return React.createElement(
    nodeComponent,
    props,
    React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
  );
}

export default ReactComponentNodeRender;
