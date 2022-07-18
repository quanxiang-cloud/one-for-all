import React from 'react';

import useInstantiateProps from '../use-instantiate-props';
import { ChildrenRender } from './index';
import type { ReactComponentNode } from '../types';
import { useLifecycleHook } from './hooks';
import useNodeComponent from './hooks/use-node-component';
import useCTX from '../use-ctx';

interface Props {
  node: ReactComponentNode;
}

function ReactComponentNodeRender({ node }: Props): React.ReactElement | null {
  const ctx = useCTX();
  const props = useInstantiateProps(node);
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
    React.createElement(ChildrenRender, { nodes: node.children || [] }),
  );
}

export default ReactComponentNodeRender;
