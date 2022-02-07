import React from 'react';
import { logger } from '@one-for-all/utils';

import LoopIndividual from './loop-individual';
import LoopComposed from './loop-composed';
import type { CTX, LoopContainerNode } from '../../types';
import { useLifecycleHook } from '../hooks';

type Props = {
  node: LoopContainerNode;
  ctx: CTX;
}

function LoopNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});

  const { node: LoopNode } = node;

  if (LoopNode.type !== 'composed-node' && 'toProps' in node) {
    return React.createElement(LoopIndividual, {
      iterableState: node.iterableState,
      loopKey: node.loopKey,
      node: LoopNode,
      toProps: (v: unknown) => node.toProps(v),
      ctx,
    });
  }

  if (LoopNode.type === 'composed-node') {
    return React.createElement(LoopComposed, {
      iterableState: node.iterableState,
      loopKey: node.loopKey,
      node: LoopNode,
      ctx,
    });
  }

  logger.error('Unrecognized loop node:', node);

  return null;
}

export default LoopNodeRender;
