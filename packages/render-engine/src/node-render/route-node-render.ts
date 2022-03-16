import React, { useContext } from 'react';

import NodeRender from '.';
import RouteContext from './route-context';
import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode } from '../types';
import PathContext from './path-context';
import useRouteState from './hooks/use-route-state';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const routeState = useRouteState(ctx);
  const parentPath = useContext(PathContext);
  const currentPath = `${parentPath}/${node.id}`;
  const parentRoutePath = useContext(RouteContext);
  const _currentRoutePath = [...parentRoutePath, node.path.replace(/\/+$/, '').replace(/^\/*/, '')];
  const currentRoutePath = `${_currentRoutePath.join('/')}`.replace(/\/+$/, '').replace(/^\/*/, '/');

  if (routeState.pathname?.startsWith(currentRoutePath)) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(
        RouteContext.Provider,
        { value: [...parentRoutePath] },
        React.createElement(NodeRender, { node: node.node, ctx })
      )
    );
  }

  return null;
}

export default RouteNodeRender;
