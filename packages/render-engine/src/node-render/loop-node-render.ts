import React from 'react';

import LoopContainer from '../builtin-components/loop-container';
import type { CTX, Instantiated, LoopContainerNode } from '../types';
import { useLifecycleHook } from './hooks';

type Props = {
  node: LoopContainerNode<Instantiated>;
  ctx: CTX;
}

function LoopNodeRender({ node, ctx }: Props): React.ReactElement {
  useLifecycleHook(node.lifecycleHooks || {});

  return React.createElement(LoopContainer, {
    iterableState: node.iterableState,
    loopKey: node.loopKey,
    node: node.node,
    toProps: (v: unknown) => node.toProps(v),
    ctx,
  });
}

export default LoopNodeRender;
