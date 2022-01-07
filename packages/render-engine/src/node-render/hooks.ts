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
  CTX,
  RefLoader,
  SchemaNode,
} from '../types';
import initCTX from '../ctx';
import deserializeSchema from '../deserialize-schema';

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

type RefResult = { refCTX: CTX; refNode: SchemaNode<Instantiated>; }
type UseRefResultProps = {
  schemaID: string;
  refLoader?: RefLoader;
  orphan?: boolean;
}

export function useRefResult(
  { schemaID, refLoader, orphan }: UseRefResultProps,
  ctx: CTX,
): RefResult | undefined {
  const [result, setResult] = useState<RefResult | undefined>();
  const currentPath = useContext(PathContext);

  useEffect(() => {
    if (!schemaID) {
      logger.error(`schemaID is required on RefNode, please check the spec for node: ${currentPath}`);
      return;
    }

    if (!refLoader) {
      logger.error(
        'refLoader is required on RefNode in order to get ref schema and corresponding APISpecAdapter,',
        'please implement refLoader and pass it to parent RenderEngine.',
        `current RefNode path is: ${currentPath}`,
      );
      return;
    }

    let unMounting = false;

    refLoader(schemaID).then((initProps) => {
      if (unMounting) {
        return;
      }

      const refCTX = initCTX(initProps, orphan ? undefined : ctx);
      const instantiatedNode = deserializeSchema(initProps.schema.node, refCTX);
      if (!instantiatedNode) {
        // TODO: paint error
        return;
      }

      setResult({ refCTX, refNode: instantiatedNode });
    }).catch((err) => {
      logger.error(err);
    });

    return () => {
      unMounting = true;
    };
  }, []);

  return result;
}
