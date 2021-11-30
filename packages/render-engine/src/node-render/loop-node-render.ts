import React from 'react';

import LoopContainer from '../builtin-components/loop-container';
import type { CTX, Instantiated, LoopContainerNode } from '../types';

type Props = {
  node: LoopContainerNode<Instantiated>;
  ctx: CTX;
}

function LoopNodeRender({ node, ctx }: Props): React.ReactElement {
  return React.createElement(LoopContainer, {
    iterableState: node.props.iterableState,
    // todo fixme
    loopKey: node.props.loopKey.value as string,
    node: node.props.node.value,
    // todo handle error
    toProps: (v: unknown) => node.props.toProps.func(v) as Record<string, unknown>,
    ctx,
  });
}

export default LoopNodeRender;
