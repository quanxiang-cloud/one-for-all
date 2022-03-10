import React from 'react';

import NodeRender from '.';
import type { CTX, RouteNode } from '../types';
import { useLifecycleHook } from './hooks';

interface Props {
  node: RouteNode;
  ctx: CTX;
}

function RouteNodeRender({ node, ctx }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const nodePath = node.path.replace(/\/+$/, '').replace(/^\/*/, '/'); // to format route node path

  ctx.urlPush?.('/app/with/test/:id/ad?pageID=aaaaa', { form: '/' });

  console.log(nodePath);
  if (ctx.routeState?.location.pathname === nodePath) {
    return React.createElement(NodeRender, { node: node.node, ctx });
  }

  return null;
}

export default RouteNodeRender;
