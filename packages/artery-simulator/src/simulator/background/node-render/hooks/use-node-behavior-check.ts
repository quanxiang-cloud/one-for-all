import { useContext, useEffect, useState } from 'react';

import { NodePrimary } from '../../../../types';
import { _cacheIsNodeSupportChildren, _checkIfNodeSupportChildren } from '../../../cache';
import { HTMLNode, ReactComponentNode } from '@one-for-all/artery-renderer';
import { checkNodeSupportChildren } from '../../../bridge';

function asyncCheckIfNodeSupportChildren(node: NodePrimary): Promise<boolean> {
  const flag = _checkIfNodeSupportChildren(node);
  if (flag !== undefined) {
    return Promise.resolve(flag);
  }

  return checkNodeSupportChildren(node).then((isSupportChildren) => {
    _cacheIsNodeSupportChildren(node, isSupportChildren);

    return isSupportChildren;
  });
}

function toNodePrimary(node: HTMLNode | ReactComponentNode): NodePrimary {
  if (node.type === 'html-element') {
    return { type: 'html-element', name: node.name };
  }

  return {
    type: 'react-component',
    packageName: node.packageName,
    packageVersion: node.packageName,
    exportName: node.exportName,
  };
}

// check node support children and whether should be rendered in modal layer
export default function useNodeBehaviorCheck(node: HTMLNode | ReactComponentNode): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unMounting = false;

    asyncCheckIfNodeSupportChildren(toNodePrimary(node)).then(() => {
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
