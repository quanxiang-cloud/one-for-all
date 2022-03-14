import React, { useContext } from 'react';

import NodeRender from '.';
import RouteContext from './route-context';
import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode } from '../types';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  // format path with single symbol '/' ---> .replace(/\/+$/, '').replace(/^\/*/, '/')
  useLifecycleHook(node.lifecycleHooks || {});
  const parentRoutePath = useContext(RouteContext);
  const _currentRoutePath = [...parentRoutePath, node.path.replace(/\/+$/, '').replace(/^\/*/, '')];

  const currentRoutePath = `${_currentRoutePath.join('/')}`.replace(/\/+$/, '').replace(/^\/*/, '/');

  if (ctx.routeState.location.pathname.startsWith(currentRoutePath)) {
    return React.createElement(
      RouteContext.Provider,
      { value: _currentRoutePath },
      React.createElement(NodeRender, { node: node.node, ctx })
    );
  }

  return null;
}

export default RouteNodeRender;
