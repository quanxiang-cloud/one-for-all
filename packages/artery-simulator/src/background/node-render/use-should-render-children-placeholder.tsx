import { HTMLNode, ReactComponentNode } from '@one-for-all/artery-renderer';
import { useContext, useEffect, useState } from 'react';
import { cacheIsNodeSupportChildren, getIsNodeSupportChildrenFromCache, getNodeExecutor } from '../../utils';
import { ArteryCtx } from '../../contexts';
import { getParentNode } from './placeholder';

export default function useShouldRenderChildrenPlaceholder(parent: HTMLNode | ReactComponentNode): boolean {
  const { isNodeSupportChildren } = useContext(ArteryCtx);
  const [shouldRender, setShouldRender] = useState(!!parent.children);

  useEffect(() => {
    let unMounting = false;

    const flag = getIsNodeSupportChildrenFromCache(getNodeExecutor(parent));
    if (flag !== undefined) {
      setShouldRender(flag);
      return;
    }

    if (!isNodeSupportChildren) {
      return;
    }

    isNodeSupportChildren(getParentNode(parent))
      .then((flag) => {
        cacheIsNodeSupportChildren(parent, flag);

        if (!unMounting) {
          setShouldRender(flag);
        }
      })
      .catch(() => { });

    return () => {
      unMounting = true;
    };
  }, []);

  return shouldRender;
}
