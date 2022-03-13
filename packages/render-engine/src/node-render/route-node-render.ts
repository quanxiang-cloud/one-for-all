import React, { useContext } from 'react';

import NodeRender from '.';
import RouteContext from './route-context';
import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode, SchemaNode } from '../types';

export interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteMatchNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const matches = useContext(RouteContext);
  const match = matches.find(({ path }) => {
    return path.replace(/\/+$/, '').replace(/^\/*/, '/') === ctx.routeState?.location.pathname;
  });

  console.log(ctx.routeState);
  if (!match) {
    return null;
  }

  return React.createElement(NodeRender, { node: match.element as SchemaNode, ctx });
}

export default RouteMatchNodeRender;
