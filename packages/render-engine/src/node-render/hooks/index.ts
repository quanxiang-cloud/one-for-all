import { useContext, useEffect, useState } from 'react';
import { logger } from '@one-for-all/utils';

import PathContext from '../path-context';
import bootUp, { BootResult } from '../../boot-up';
import useInstantiateProps from '../../use-instantiate-props';
import type { CTX, RefLoader, LifecycleHooks, SchemaNode } from '../../types';
import SchemaSpec from 'packages/schema-spec/src';

export function useLifecycleHook({ didMount, willUnmount }: LifecycleHooks): void {
  useEffect(() => {
    didMount?.();

    return () => {
      willUnmount?.();
    };
  }, []);
}

interface UseRefResultProps {
  schemaID: string;
  refLoader?: RefLoader;
  orphan?: boolean;
}

export function useRefResult(
  { schemaID, refLoader, orphan }: UseRefResultProps,
  parentCTX: CTX,
): BootResult | undefined {
  const [result, setResult] = useState<BootResult>();
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
    let _schema: SchemaSpec.Schema | undefined;

    refLoader(schemaID)
      .then(({ schema, plugins }) => {
        if (unMounting) {
          return;
        }

        _schema = schema;

        return bootUp({
          plugins,
          schema,
          parentCTX: orphan ? undefined : parentCTX,
        });
      })
      .then((refBootResult) => {
        if (!refBootResult || !_schema) {
          return;
        }

        setResult({ ctx: refBootResult.ctx, rootNode: refBootResult.rootNode });
      })
      .catch(logger.error);

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
