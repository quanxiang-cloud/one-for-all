import type { HTMLNode, ReactComponentNode } from '@one-for-all/artery-renderer';
import React, { useContext, useEffect, useState } from 'react';
import { cacheIsNodeSupportChildren, getIsNodeSupportChildrenFromCache, getNodeExecutor } from '../../utils';
import { ArteryCtx } from '../../contexts';
import { NodePrimary } from '../../types';

interface Props {
  parent: HTMLNode | ReactComponentNode;
}

function getParentNode(parent: HTMLNode | ReactComponentNode): NodePrimary {
  if (parent.type === 'html-element') {
    return { type: 'html-element', name: parent.name };
  }

  return {
    type: 'react-component',
    packageName: parent.packageName,
    packageVersion: parent.packageVersion,
    exportName: parent.exportName,
  };
}

function EmptyPlaceholder(): JSX.Element {
  return <div>请拖拽组件到此处！</div>;
}

function Placeholder({ parent }: Props): JSX.Element | null {
  const { isNodeSupportChildren } = useContext(ArteryCtx);
  const [shouldRender, setShouldRender] = useState(false);

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
      .catch(() => {});

    return () => {
      unMounting = true;
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return React.createElement(
    'div',
    { className: 'placeholder-for-empty-children' },
    React.createElement(EmptyPlaceholder),
  );
}

export default Placeholder;
