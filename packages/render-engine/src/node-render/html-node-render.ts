import React from 'react';

import useInstantiateProps from '../use-instantiate-props';
import type { CTX, HTMLNode, Instantiated } from '../types';
import { ChildrenRender } from './index';
import { useLifecycleHook } from './hooks';

type Props = {
  node: HTMLNode<Instantiated>;
  ctx: CTX;
}

function HTMLNodeRender({ node, ctx }: Props): React.ReactElement {
  const props = useInstantiateProps(node, ctx);
  useLifecycleHook(node.lifecycleHooks || {});

  if (!node.children || !node.children.length) {
    return React.createElement(node.name, props);
  }

  return React.createElement(
    node.name,
    props,
    React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
  );
}

export default HTMLNodeRender;
