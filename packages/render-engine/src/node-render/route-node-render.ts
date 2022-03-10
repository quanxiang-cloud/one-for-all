import React, { useContext } from 'react';
import NodeRender from '.';

import type { CTX, RouteNode } from '../types';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';

interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);

  console.log(ctx.routeState);
  if (ctx.routeState?.location.pathname === node.path) {
    return React.createElement(NodeRender, { node: node.node, ctx });
  }

  return null;
}

export default RouteNodeRender;
