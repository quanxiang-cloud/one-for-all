import React from 'react';

import LoopContainer from '../builtin-components/loop-container';
import type { CTX, Instantiated, LoopContainerNode } from '../types';
import { useLifecycleHook } from './hooks';

type Props = {
  node: LoopContainerNode<Instantiated>;
  ctx: CTX;
}

function LoopNodeRender({ node, ctx }: Props): React.ReactElement {
  useLifecycleHook(node);

  return React.createElement(LoopContainer, {
    iterableState: node.iterableState,
    loopKey: node.loopKey,
    node: node.node,
    // todo handle error
    toProps: (v: unknown) => node.toProps.func(v) as Record<string, unknown>,
    ctx,
  });
}

export default LoopNodeRender;
