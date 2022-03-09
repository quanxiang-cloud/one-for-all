import React, { useContext } from 'react';
import NodeRender from '.';

import type { CTX, RouteNode } from '../types';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';
import RouteContext from './route-context';

interface Props {
  node: RouteNode;
  ctx: CTX;
  routerCTX?: any;
}

function RouteNodeRender({ node, ctx, routerCTX }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);
  const currentRouteInfo = useContext(RouteContext);

  if (routerCTX.location.pathname === node.path) {
    console.log('render node');
    return React.createElement(NodeRender, { node: node.node, ctx });
  }

  console.log('render null');
  return null;
}

export default RouteNodeRender;
