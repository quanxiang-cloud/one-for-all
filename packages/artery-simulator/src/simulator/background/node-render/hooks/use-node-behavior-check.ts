import { useContext, useEffect, useState } from 'react';

import { NodePrimary } from '../../../../types';
import {
  cacheIsNodeSupportChildren,
  cacheNodeIsModalLayer,
  checkIfNodeIsModalLayer,
  checkIfNodeSupportChildren,
} from '../../../cache';
import { ArteryCtx } from '../../../contexts';
import { HTMLNode, ReactComponentNode } from '@one-for-all/artery-renderer';

function asyncCheckIfNodeSupportChildren(
  node: NodePrimary,
  checker: (node: NodePrimary) => Promise<boolean>,
): Promise<boolean> {
  const flag = checkIfNodeSupportChildren(node);
  if (flag !== undefined) {
    return Promise.resolve(flag);
  }

  return checker(node).then((isSupportChildren) => {
    cacheIsNodeSupportChildren(node, isSupportChildren);

    return isSupportChildren;
  });
}

function asyncCheckIfNodeShouldRenderInModalLayer(
  node: NodePrimary,
  checker: (node: NodePrimary) => Promise<boolean>,
): Promise<boolean> {
  const flag = checkIfNodeIsModalLayer(node);
  if (flag !== undefined) {
    return Promise.resolve(flag);
  }

  return checker(node).then((isModalLayerRoot) => {
    cacheNodeIsModalLayer(node, isModalLayerRoot);
    return isModalLayerRoot;
  });
}

// check node support children and whether should be rendered in modal layer
export default function useNodeBehaviorCheck(node: HTMLNode | ReactComponentNode): boolean {
  const { isNodeSupportChildren, isNodeInModalLayer } = useContext(ArteryCtx);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unMounting = false;

    Promise.all([
      asyncCheckIfNodeSupportChildren(node, isNodeSupportChildren),
      asyncCheckIfNodeShouldRenderInModalLayer(node, isNodeInModalLayer),
    ]).then(() => {
      if (!unMounting) {
        setLoading(false);
      }
    });

    return () => {
      unMounting = true;
    };
  }, []);

  return loading;
}
