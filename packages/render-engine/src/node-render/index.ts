import React, { useContext } from 'react';
import { logger } from '@ofa/utils';

import HTMLNodeRender from './html-node-render';
import LoopNodeRender from './loop-node-render';
import ReactComponentNodeRender from './react-component-node-render';
import type { CTX, InstantiatedNode } from '../types';
import { NodeType } from '../types';
import PathContext from './path-context';

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
  const parentPath = useContext(PathContext);
  const currentPath = `${parentPath}/${node.id}`;

  if (node.type === NodeType.LoopContainerNode) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(LoopNodeRender, { node, ctx }),
    );
  }

  if (node.type === NodeType.HTMLNode) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(HTMLNodeRender, { node, ctx }),
    );
  }

  if (node.type === NodeType.ReactComponentNode) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(ReactComponentNodeRender, { node, ctx }),
    );
  }

  logger.error('Unrecognized node type of node:', node);
  return null;
}

export default NodeRender;
