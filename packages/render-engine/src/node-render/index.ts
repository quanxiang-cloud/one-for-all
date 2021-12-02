import React from 'react';

import HTMLNodeRender from './html-node-render';
import LoopNodeRender from './loop-node-render';
import ReactComponentNodeRender from './react-component-node-render';
import type { CTX, InstantiatedNode } from '../types';
import { NodeType } from '../types';

type ChildrenRenderProps = {
  nodes: InstantiatedNode[];
  ctx: CTX;
}

export function ChildrenRender(
  { nodes, ctx }: ChildrenRenderProps,
): React.FunctionComponentElement<Record<string, unknown>> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(NodeRender, { key: node.id, node: node, ctx })),
  );
}

type Props = {
  node: InstantiatedNode;
  ctx: CTX;
}

function NodeRender({ node, ctx }: Props): React.ReactElement | null {
  if (node.type === NodeType.LoopContainerNode) {
    return React.createElement(LoopNodeRender, { node, ctx });
  }

  if (node.type === NodeType.HTMLNode) {
    return React.createElement(HTMLNodeRender, { node, ctx });
  }

  return React.createElement(ReactComponentNodeRender, { node, ctx });
}

export default NodeRender;
