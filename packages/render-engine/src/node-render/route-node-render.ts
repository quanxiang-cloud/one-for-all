import React, { useContext } from 'react';

import type { CTX, RouteNode } from '../types';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';
import RouteContext from './route-context';

interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);
  const currentRouteInfo = useContext(RouteContext);

  return null;
}

export default RouteNodeRender;
