import React from 'react';

import LoopContainer from '../builtin-components/loop-container';
import type { CTX, Instantiated, LoopContainerNode } from '../types';

type Props = {
  node: LoopContainerNode<Instantiated>;
  ctx: CTX;
}

function LoopNodeRender({ node, ctx }: Props): React.ReactElement {
  return React.createElement(LoopContainer, {
    iterableState: node.iterableState,
    // todo fixme
    loopKey: node.loopKey,
    node: node.node,
    // todo handle error
    toProps: (v: unknown) => node.toProps.func(v) as Record<string, unknown>,
    ctx,
  });
}

export default LoopNodeRender;
