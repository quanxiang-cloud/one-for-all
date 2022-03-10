import React from 'react';

import NodeRender from '.';
import type { CTX, RouteNode } from '../types';
import { useLifecycleHook } from './hooks';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const nodePath = node.path.replace(/\/+$/, '').replace(/^\/*/, '/'); // to format route node path
  // const fullPath = ctx.routeState?.location.pathname.split('?')[0].split('/');

  if (ctx.routeState?.location.pathname === nodePath) {
    return React.createElement(NodeRender, { node: node.node, ctx });
  }

  return null;
}

export default RouteNodeRender;
