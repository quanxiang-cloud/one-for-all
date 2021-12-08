import { useContext, useEffect, useState } from 'react';
import { logger } from '@ofa/utils';

import { importComponent } from '../repository';
import PathContext from './path-context';
import type {
  DynamicComponent,
  Repository,
  Instantiated,
  ReactComponentNode,
  LifecycleHooks,
} from '../types';

export function useLifecycleHook({ didMount, willUnmount }: LifecycleHooks<Instantiated>): void {
  useEffect(() => {
    if (didMount) {
      didMount();
    }

    return () => {
      willUnmount?.();
    };
  }, []);
}

export function useNodeComponent(
  node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'>,
  repository?: Repository,
): DynamicComponent | null {
  const [lazyLoadedComponent, setComponent] = useState<DynamicComponent | null>(null);
  const currentPath = useContext(PathContext);

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
          `please check the spec for node: ${currentPath}.`,
        );
        return;
      }

      setComponent(() => comp);
    });
  }, []);

  return lazyLoadedComponent;
}
