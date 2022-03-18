import React from 'react';

import NodeRender from './index';
import { useLifecycleHook, useRefResult } from './hooks';
import type { CTX, RefNode } from '../types';

interface Props {
  node: RefNode;
  ctx: CTX;
}

export default function RefNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const result = useRefResult(
    { schemaID: node.schemaID, refLoader: ctx.plugins.refLoader, orphan: node.orphan },
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
