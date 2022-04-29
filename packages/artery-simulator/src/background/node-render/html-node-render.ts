import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';
import type { CTX, HTMLNode } from '@one-for-all/artery-renderer';

import ChildrenRender from './children-render';
import PathContext from './path-context';
import useHTMLNodeProps from './hooks/use-html-node-props';
import Placeholder from './placeholder';
import { useSupportChildrenCheck } from './use-support-children-check';

interface Props {
  node: HTMLNode;
  ctx: CTX;
}

function HTMLNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const currentPath = useContext(PathContext);
  const props = useHTMLNodeProps(node, ctx);
  useSupportChildrenCheck(node);

  if (!node.name) {
    logger.error(
      'name property is required in html node spec,',
      `please check the spec of node: ${currentPath}.`,
    );
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(node.name, props, React.createElement(Placeholder, { parent: node }));
  }

  return React.createElement(
    node.name,
    props,
    React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
  );
}

export default HTMLNodeRender;
