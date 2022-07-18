import React, { useContext } from 'react';

import NodeRender from '../index';
import RoutePathContext from './route-path-context';
import useMatch from './use-match';
import { trimSlash } from './utils';
import { useLifecycleHook } from '../hooks';
import type { RouteNode } from '../../types';
import useCTX from '../../use-ctx';

export interface Props {
  node: RouteNode;
}

function buildCurrentPath(parentPath: string, routePath: string): string {
  if (parentPath === '/') {
    return `/${trimSlash(routePath)}`;
  }

  return `${parentPath}/${trimSlash(routePath)}`;
}

function RouteNodeRender({ node }: Props): React.ReactElement | null {
  const ctx = useCTX();
  useLifecycleHook(node.lifecycleHooks || {});

  const parentRoutePath = useContext(RoutePathContext);
  const currentRoutePath = buildCurrentPath(parentRoutePath, node.path);
  const match = useMatch(ctx.location$, currentRoutePath, node.exactly ?? false);

  if (match) {
    return React.createElement(
      RoutePathContext.Provider,
      { value: currentRoutePath },
      React.createElement(NodeRender, { node: node.node, ctx }),
    );
  }

  return null;
}

export default RouteNodeRender;
