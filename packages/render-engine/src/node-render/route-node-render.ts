import React, { useContext } from 'react';

import NodeRender from '.';
import PathContext from './path-context';
import RouteContext from './route-context';
import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode } from '../types';
import useRouteMatchedState from './hooks/use-route-state';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const parentPath = useContext(PathContext);
  const currentPath = `${parentPath}/${node.id}`;
  const parentRoutePath = useContext(RouteContext);
  const _currentRoutePath = [...parentRoutePath, node.path.replace(/\/+$/, '').replace(/^\/*/, '')];
  const currentRoutePath = `${_currentRoutePath.join('/')}`.replace(/\/+$/, '').replace(/^\/*/, '/');
  const matched = useRouteMatchedState(ctx.routeState$, currentRoutePath);

  if (matched) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(
        RouteContext.Provider,
        { value: [..._currentRoutePath] },
        React.createElement(NodeRender, { node: node.node, ctx })
      )
    );
  }

  return null;
}

export default RouteNodeRender;
