import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';

import useInstantiateProps from '../use-instantiate-props';
import type { CTX, HTMLNode } from '../types';
import { ChildrenRender } from './index';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';

interface Props {
  node: HTMLNode;
  ctx: CTX;
}

function HTMLNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const props = useInstantiateProps(node, ctx);
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);

  if (!node.name) {
    logger.error(
      'name property is required in html node spec,',
      `please check the spec of node: ${currentPath}.`,
    );
    return null;
  }

  if (!node.children || !node.children.length) {
    if (node.name === 'span') {
      console.log(props)
    }
    return React.createElement(node.name, props);
  }

  return React.createElement(
    node.name,
    props,
    React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
  );
}

export default HTMLNodeRender;
