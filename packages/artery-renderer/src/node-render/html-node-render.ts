import React, { useContext } from 'react';
import { logger } from '@one-for-all/utils';

import useInstantiateProps from '../use-instantiate-props';
import type { HTMLNode } from '../types';
import { ChildrenRender } from './index';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';
import useCTX from '../use-ctx';

interface Props {
  node: HTMLNode;
}

function HTMLNodeRender({ node }: Props): React.ReactElement {
  const ctx = useCTX();
  const props = useInstantiateProps(node);
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);

  if (!node.name) {
    logger.error(
      'name property is required in html node spec,',
      `please check the spec of node: ${currentPath}.`,
    );
    return React.createElement(React.Fragment);
  }

  if (!node.children || !node.children.length) {
    return React.createElement(node.name, props);
  }

  return React.createElement(
    node.name,
    props,
    React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
  );
}

export default HTMLNodeRender;
