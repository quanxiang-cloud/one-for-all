import React, { useContext } from 'react';

import NodeRender from '.';
import RouteContext from './route-context';
import { useLifecycleHook } from './hooks';
import type { CTX, RouteNode, SchemaNode } from '../types';
import HTMLNodeRender from './html-node-render';
import { render } from '@testing-library/react';

export interface Props {
  node: RouteNode;
  ctx: CTX;
  parentRoute?: string;
}

function RouteNodeRender({ node, ctx, parentRoute }: Props): React.ReactElement | null {
  useLifecycleHook(node.lifecycleHooks || {});
  const currentRoutePath = `${parentRoute}/${node.path}`.replace(/\/+$/, '').replace(/^\/*/, '/');

  console.log(ctx.routeState.location.pathname, currentRoutePath, parentRoute);
  
  if (ctx.routeState.location.pathname === currentRoutePath) {
    return React.createElement(NodeRender, { node: node.node, ctx, parentRoute: currentRoutePath, });
  }

  // if (node.node.type !== 'route-node') {
  //   return React.createElement(NodeRender, { node: node.node, ctx, parentRoute: `${parentRoute}/${node.path}`, });
  // }

  // if (parentRouteNodePath === node.path) {
  //   if (node.node.type === 'html-element') {
  //     return React.createElement(NodeRender, { node: node.node, ctx });
  //   }
  // }

  // const match = matches.find(({ path }) => {
  //   return path.replace(/\/+$/, '').replace(/^\/*/, '/') === ctx.routeState?.location.pathname;
  // });

  // console.log(ctx.routeState);
  // if (!match) {
  //   return null;
  // }

  // return React.createElement(NodeRender, { node: match.element as SchemaNode, ctx });
  return null;
}

export default RouteNodeRender;
