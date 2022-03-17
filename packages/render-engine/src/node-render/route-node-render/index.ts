import React, { useContext } from 'react';

import NodeRender from '../index';
import RoutePathContext from './route-path-context';
import useMatch from './use-match';
import { trimSlash } from './utils';
import { useLifecycleHook } from '../hooks';
import type { CTX, RouteNode } from '../../types';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});

  const parentRoutePath = useContext(RoutePathContext);
  const currentRoutePath = `${parentRoutePath}/${trimSlash(node.path)}`;
  const match = useMatch(ctx.historyState.location$, currentRoutePath, node.exactly ?? false);

  if (match) {
    return React.createElement(
      RoutePathContext.Provider,
      { value: currentRoutePath },
      React.createElement(NodeRender, { node: node.node, ctx })
    );
  }

  return null;
}

export default RouteNodeRender;
