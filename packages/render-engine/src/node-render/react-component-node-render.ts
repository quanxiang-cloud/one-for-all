import React, { useEffect, useState } from 'react';
import { logger } from '@ofa/utils';

import useInstantiateProps from '../use-instantiate-props';
import { importComponent } from '../repository';
import { ChildrenRender } from './index';
import type { CTX, DynamicComponent, Repository, Instantiated, ReactComponentNode } from '../types';
import { useLifecycleHook } from './hooks';

function useNodeComponent(
  node: ReactComponentNode<Instantiated>,
  repository?: Repository,
): DynamicComponent | undefined {
  const [lazyLoadedComponent, setComponent] = useState<DynamicComponent | undefined>();

  useEffect(() => {
    const packageNameVersion = `${node.packageName}@${node.packageVersion}`;
    if (repository?.[packageNameVersion]?.[node.exportName || 'default']) {
      setComponent(() => repository?.[packageNameVersion]?.[node.exportName || 'default']);
      return;
    }

    importComponent({
      packageName: node.packageName,
      version: node.packageVersion,
      exportName: node.exportName,
    }).then((comp) => {
      if (!comp) {
        logger.error(
          `got empty component for package: ${node.packageName},`,
          `exportName: ${node.exportName}, version: ${node.packageVersion}`,
        );
        return;
      }

      setComponent(() => comp);
    });
  }, []);

  return lazyLoadedComponent;
}

type Props = {
  node: ReactComponentNode<Instantiated>;
  ctx: CTX;
}

function ReactComponentNodeRender({ node, ctx }: Props): React.ReactElement | null {
  const props = useInstantiateProps(node, ctx);
  const nodeComponent = useNodeComponent(node, ctx.repository);
  useLifecycleHook(node);

  if (!nodeComponent) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return React.createElement(nodeComponent, props);
  }

  return (
    React.createElement(
      nodeComponent,
      props,
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    )
  );
}

export default ReactComponentNodeRender;
