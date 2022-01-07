import React from 'react';

import NodeRender from './index';
import { useLifecycleHook, useRefResult } from './hooks';
import type { CTX, Instantiated, RefNode } from '../types';

type Props = {
  node: RefNode<Instantiated>;
  ctx: CTX;
}

export default function RefNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const refResult = useRefResult(
    { schemaID: node.schemaID, refLoader: ctx.refLoader, orphan: node.orphan },
    ctx,
  );

  if (!refResult) {
    if (node.fallback) {
      return React.createElement(NodeRender, { node: node.fallback, ctx });
    }

    return null;
  }

  return React.createElement(NodeRender, { node: refResult.refNode, ctx: refResult.refCTX });
}
