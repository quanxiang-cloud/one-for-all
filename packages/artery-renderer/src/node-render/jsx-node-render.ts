import React, { useContext, useEffect, useState } from 'react';
import { logger } from '@one-for-all/utils';
import type { TProps } from 'react-jsx-parser';

import useInstantiateProps from '../use-instantiate-props';
import type { CTX, JSXNode } from '../types';
import { useLifecycleHook } from './hooks';
import PathContext from './path-context';

interface Props {
  node: JSXNode;
}

function useReactJSXParser(): React.Component<TProps> | null {
  const [com, setComponent] = useState<React.Component<TProps> | null>(null);

  useEffect(() => {
    let unMounting = false;
    // todo change 'react-jsx-parser' as plugin
    System.import('react-jsx-parser')
      .then((module) => {
        if (unMounting) {
          return;
        }

        setComponent(() => module.default);
      })
      .catch((err) => {
        logger.error('failed to load dependance react-jsx-parser:', err);
        return;
      });

    return () => {
      unMounting = true;
    };
  });

  return com;
}

function JSXNodeRender({ node }: Props): React.ReactElement | null {
  const props = useInstantiateProps(node);
  useLifecycleHook(node.lifecycleHooks || {});
  const currentPath = useContext(PathContext);
  const ReactJSXParser = useReactJSXParser();

  if (!node.jsx) {
    logger.error('jsx string is required,', `please check the spec of node: ${currentPath}.`);
    return null;
  }

  if (!ReactJSXParser) {
    return null;
  }

  return React.createElement(ReactJSXParser as any, {
    bindings: props,
    renderInWrapper: false,
    jsx: node.jsx,
    onError: (err: any) => console.log(err),
  });
}

export default JSXNodeRender;
