import React from 'react';
import { logger } from '@one-for-all/utils';

import LoopIndividual from './loop-individual';
import LoopComposed from './loop-composed';
import type { LoopContainerNode } from '../../types';
import { useLifecycleHook } from '../hooks';
import useCTX from '../../use-ctx';

interface Props {
  node: LoopContainerNode;
}

function LoopNodeRender({ node }: Props): React.ReactElement {
  const ctx = useCTX();
  useLifecycleHook(node.lifecycleHooks || {});

  const { node: LoopedNode } = node;

  if (LoopedNode.type !== 'composed-node' && 'toProps' in node) {
    return React.createElement(LoopIndividual, {
      iterableState: node.iterableState,
      loopKey: node.loopKey,
      node: LoopedNode,
      toProps: (v: unknown) => node.toProps(v),
      ctx,
    });
  }

  if (LoopedNode.type === 'composed-node') {
    return React.createElement(LoopComposed, {
      iterableState: node.iterableState,
      loopKey: node.loopKey,
      node: LoopedNode,
      ctx,
    });
  }

  logger.error('Unrecognized loop node:', node);

  return React.createElement(React.Fragment);
}

export default LoopNodeRender;
