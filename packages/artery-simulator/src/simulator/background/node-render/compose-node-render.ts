import React from 'react';
import { ComposedNode, CTX, HTMLNode } from '@one-for-all/artery-renderer';
import ChildrenRender from './children-render';
import HTMLNodeRender from './html-node-render';

interface Props {
  node: ComposedNode;
  ctx: CTX;
}

export default function ComposeNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const nodes = node.nodes || node.children;
  if (node.outLayer?.type === 'html-element') {
    const _outLayerNode: HTMLNode = {
      ...node.outLayer,
      children: node.nodes || node.children,
    };

    React.createElement(HTMLNodeRender, { node: _outLayerNode, ctx });
  }

  // todo support react-component as out layer

  return React.createElement(ChildrenRender, { nodes, ctx });
}
