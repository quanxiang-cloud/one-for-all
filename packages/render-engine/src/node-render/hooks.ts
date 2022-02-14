import { useContext, useEffect, useState } from 'react';
import { logger } from '@one-for-all/utils';

import { importComponent } from '../repository';
import PathContext from './path-context';
import initCTX from '../ctx';
import deserializeSchema from '../deserialize-schema';
import useInstantiateProps from '../use-instantiate-props';
import type {
  CTX,
  RefLoader,
  Repository,
  LifecycleHooks,
  DynamicComponent,
  SchemaNode,
  ReactComponentNode,
} from '../types';

export function useLifecycleHook({ didMount, willUnmount }: LifecycleHooks): void {
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
  node: Pick<ReactComponentNode, 'packageName' | 'packageVersion' | 'exportName'>,
  repository?: Repository,
): DynamicComponent | null {
  const [lazyLoadedComponent, setComponent] = useState<DynamicComponent | null>(null);
  const currentPath = useContext(PathContext);

  useEffect(() => {
    let unMounting = true;
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
      if (!unMounting) {
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
    });

    return () => {
      unMounting = false;
    };
  }, []);

  return lazyLoadedComponent;
}

type RefResult = { refCTX: CTX; refNode: SchemaNode; }
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

    refLoader(schemaID).then(({ schema, plugins }) => {
      if (unMounting) {
        return;
      }

      const refCTX = initCTX({
        plugins,
        apiStateSpec: schema.apiStateSpec,
        sharedStatesSpec: schema.sharedStatesSpec,
        parentCTX: orphan ? undefined : ctx,
      });
      const instantiatedNode = deserializeSchema(schema.node, refCTX);
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

export function useShouldRender(node: SchemaNode, ctx: CTX): boolean {
  const condition = node.shouldRender;
  const placeholderNode: SchemaNode = {
    id: 'placeholder-node',
    type: 'html-element',
    name: 'div',
    props: condition ? { shouldRender: condition } : undefined,
  };

  const { shouldRender } = useInstantiateProps(placeholderNode, ctx);

  if (!condition) {
    return true;
  }

  if (condition.type === 'api_loading_property') {
    return condition.revert ? !shouldRender : !!shouldRender;
  }

  return !!shouldRender;
}
