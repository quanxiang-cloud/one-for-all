import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';
import type { CTX, HTMLNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import DepthContext from './depth-context';
import useHTMLNodeProps from './hooks/use-html-node-props';
import Placeholder from './placeholder';
import { useSupportChildrenCheck } from './use-support-children-check';

interface Props {
  node: HTMLNode;
  ctx: CTX;
}

function HTMLNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentDepth = useContext(DepthContext) + 1;
  const props = useHTMLNodeProps(node, ctx, currentDepth);
  useSupportChildrenCheck(node);

  if (!node.name) {
    logger.error(
      'name property is required in html node spec,',
      `please check the spec of node: ${node.id}.`,
    );
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(node.name, props, React.createElement(Placeholder, { parent: node }));
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
