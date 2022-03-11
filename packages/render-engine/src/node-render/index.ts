import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';

import PathContext from './path-context';
import { useShouldRender } from './hooks';
import { CTX, RouteNode, SchemaNode } from '../types';
import JSXNodeRender from './jsx-node-render';
import RefNodeRender from './ref-node-render';
import HTMLNodeRender from './html-node-render';
import LoopNodeRender from './loop-node-render';
import RouteNodeRender from './route-node-render';
import ReactComponentNodeRender from './react-component-node-render';
import RouteContext from './route-context';

interface ChildrenRenderProps {
  nodes: SchemaNode[];
  ctx: CTX;
}

export function ChildrenRender({
  nodes,
  ctx,
}: ChildrenRenderProps): React.FunctionComponentElement<Record<string, unknown>> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(NodeRender, { key: node.id, node: node, ctx })),
  );
}

interface Props {
  node: SchemaNode;
  ctx: CTX;
}

// to get route node component tree
function getMatchRoutes(node: RouteNode): { path: string, element: unknown}[] {
  const parentPath = node.path;
  const matches: { path: string, element: unknown}[] = [{path: parentPath, element: node.node}];

  if(node.children?.length) {
    node.children.forEach((childNode) => {
      const path = [parentPath, childNode.path].join('/');
      const element = {...node.node, children: [ childNode.node ]};
      matches.push({ path, element });

      if(childNode.children?.length) {
        const c_mathes = getMatchRoutes(childNode);        
        c_mathes.forEach((c_match) => {
          matches.push({
            path: [parentPath, c_match.path].join('/'),
            element: {...element, children: c_match.element}
          });
        });
      }
    });
  }

  return matches;
}

function NodeRender({ node, ctx }: Props): React.ReactElement | null {
  const parentPath = useContext(PathContext);
  const parentMatch = useContext(RouteContext);
  const currentPath = `${parentPath}/${node.id}`;
  const shouldRender = useShouldRender(node, ctx);

  if (!shouldRender) {
    return null;
  }

  if (node.type === 'route-node') {
    // todo get route nested relationship component and path
    const matches = getMatchRoutes(node);
    return React.createElement(
      RouteContext.Provider,
      { value: parentMatch.concat(matches) },
      React.createElement(RouteNodeRender, { node, ctx })
    );
  }

  if (node.type === 'loop-container') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(LoopNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'html-element') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(HTMLNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'react-component') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(ReactComponentNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'ref-node') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(RefNodeRender, { node, ctx }),
    );
  }

  if (node.type === 'jsx-node') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(JSXNodeRender, { node, ctx }),
    );
  }

  logger.error('Unrecognized node type of node:', node);
  return null;
}

export default NodeRender;
