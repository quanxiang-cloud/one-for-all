import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';
import type { CTX, HTMLNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import DepthContext from './depth-context';
import useHTMLNodeProps from './hooks/use-html-node-props';
import Placeholder from './placeholder';
import { _checkIfNodeSupportChildren } from '../../cache';
import useNodeBehaviorCheck from './hooks/use-node-behavior-check';

interface Props {
  node: HTMLNode;
  ctx: CTX;
}

function HTMLNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentDepth = useContext(DepthContext) + 1;
  const props = useHTMLNodeProps(node, ctx, currentDepth);
  const loading = useNodeBehaviorCheck(node);

  if (loading) {
    return null;
  }

  if (!node.name) {
    logger.error(
      'name property is required in html node spec,',
      `please check the spec of node: ${node.id}.`,
    );
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(
      node.name,
      props,
      _checkIfNodeSupportChildren(node) ? React.createElement(Placeholder, { parent: node }) : undefined,
    );
  }

  return React.createElement(
    DepthContext.Provider,
    { value: currentDepth },
    React.createElement(
      node.name,
      props,
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    ),
  );
}

export default HTMLNodeRender;
