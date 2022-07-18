import React from 'react';

import NodeRender from './index';
import { useLifecycleHook, useRefResult } from './hooks';
import type { RefNode } from '../types';
import useCTX from '../use-ctx';

interface Props {
  node: RefNode;
}

export default function RefNodeRender({ node }: Props): React.ReactElement | null {
  const ctx = useCTX();
  useLifecycleHook(node.lifecycleHooks || {});
  const result = useRefResult(
    { arteryID: node.arteryID, refLoader: ctx.plugins.refLoader, orphan: node.orphan },
    ctx,
  );

  if (!result) {
    if (node.fallback) {
      return React.createElement(NodeRender, { node: node.fallback, ctx });
    }

    return null;
  }

  return React.createElement(NodeRender, { node: result.rootNode, ctx: result.ctx });
}
