import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';

import PathContext from './path-context';
import { useShouldRender } from './hooks';
import { ArteryNode } from '../types';
import JSXNodeRender from './jsx-node-render';
import RefNodeRender from './ref-node-render';
import HTMLNodeRender from './html-node-render';
import LoopNodeRender from './loop-node-render';
import RouteNodeRender from './route-node-render';
import ReactComponentNodeRender from './react-component-node-render';

interface ChildrenRenderProps {
  nodes: ArteryNode[];
}

export function ChildrenRender({ nodes }: ChildrenRenderProps): React.ReactElement {
  if (!nodes.length) {
    return React.createElement(React.Fragment);
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(NodeRender, { key: node.id, node: node })),
  );
}

interface Props {
  node: ArteryNode;
}

function NodeRender({ node }: Props): React.ReactElement {
  const parentPath = useContext(PathContext);
  const currentPath = `${parentPath}/${node.id}`;
  const shouldRender = useShouldRender(node);

  if (!shouldRender) {
    return React.createElement(React.Fragment);
  }

  if (node.type === 'route-node') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(RouteNodeRender, { node }),
    );
  }

  if (node.type === 'loop-container') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(LoopNodeRender, { node }),
    );
  }

  if (node.type === 'html-element') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(HTMLNodeRender, { node }),
    );
  }

  if (node.type === 'react-component') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(ReactComponentNodeRender, { node }),
    );
  }

  if (node.type === 'ref-node') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(RefNodeRender, { node }),
    );
  }

  if (node.type === 'jsx-node') {
    return React.createElement(
      PathContext.Provider,
      { value: currentPath },
      React.createElement(JSXNodeRender, { node }),
    );
  }

  logger.error('Unrecognized node type of node:', node);
  return React.createElement(React.Fragment);
}

export default NodeRender;
