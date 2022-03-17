import { useContext, useEffect, useState } from 'react';
import { logger } from '@one-for-all/utils';

import PathContext from '../path-context';
import { findComponentInRepository, systemComponentLoader } from './helper';
import type { DynamicComponent, Plugins, ReactComponentNode } from '../../types';

export default function useNodeComponent(
  node: Pick<ReactComponentNode, 'packageName' | 'packageVersion' | 'exportName'>,
  { repository, componentLoader }: Pick<Plugins, 'repository' | 'componentLoader'>,
): DynamicComponent | undefined {
  const currentPath = useContext(PathContext);
  const [lazyLoadedComponent, setComponent] = useState<DynamicComponent | undefined>(() => {
    if (!repository) {
      return;
    }

    return findComponentInRepository(repository, node);
  });

  useEffect(() => {
    if (lazyLoadedComponent) {
      return;
    }

    let unMounting = false;
    const finialLoader = componentLoader || systemComponentLoader;

    finialLoader({
      packageName: node.packageName,
      packageVersion: node.packageVersion,
      exportName: node.exportName,
    })
      .then((comp) => {
        if (unMounting) {
          return;
        }

        if (!comp) {
          logger.error(
            `got empty component for package: ${node.packageName},`,
            `exportName: ${node.exportName}, version: ${node.packageVersion}`,
            `please check the spec for node: ${currentPath}.`,
          );
          return;
        }

        setComponent(() => comp);
      })
      .catch((err) => {
        logger.error(err);
      });

    return () => {
      unMounting = true;
    };
  }, [lazyLoadedComponent]);

  return lazyLoadedComponent;
}
