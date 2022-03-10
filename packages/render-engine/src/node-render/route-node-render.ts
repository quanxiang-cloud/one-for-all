import React, { useContext } from 'react';

import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode } from '../types';
import NodeRender, { ChildrenRender } from '.';
import RouteContext from './route-context';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const parentMatch = useContext(RouteContext);
  const nodePath = node.path.replace(/\/+$/, '').replace(/^\/*/, '/'); // to format route node path
  // const fullPath = ctx.routeState?.location.pathname.split('?')[0].split('/');

  console.log(parentMatch);
  if (ctx.routeState?.location.pathname === nodePath) {
    if (!node.children || !node.children.length) {
      return React.createElement(NodeRender, { node: node.node, ctx });
    }

    return React.createElement(
      NodeRender, 
      { node: node.node, ctx }, 
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    );
  }

  return null;
}

export default RouteNodeRender;
