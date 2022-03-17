import React, { useContext } from 'react';

import NodeRender from '../index';
import PathContext from '../path-context';
import RoutePathContext from '../route-path-context';
import { useLifecycleHook } from '../hooks';
import type { CTX, RouteNode } from '../../types';
import { trimSlash } from './utils';
import useMatch from './use-match';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const parentPath = useContext(PathContext);
  const currentPath = `${parentPath}/${node.id}`;

  const parentRoutePath = useContext(RoutePathContext);
  const currentRoutePath = `${parentRoutePath}/${trimSlash(node.path)}`;
  const match = useMatch(ctx.historyState.location$, currentRoutePath, node.exactly ?? false);

  if (match) {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(
        RoutePathContext.Provider,
        { value: currentRoutePath },
        React.createElement(NodeRender, { node: node.node, ctx })
      )
    );
  }

  return null;
}

export default RouteNodeRender;
