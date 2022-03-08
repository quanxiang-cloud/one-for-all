import { useMemo, useContext } from 'react';

import { CTX, SchemaNode } from '../types';
import useConstantProps from './use-constant-props';
import useAPIResultProps from './use-api-result-props';
import useAPILoadingProps from './use-api-loading-props';
import useAPIInvokeProps from './use-api-invoke-props';
import useSharedStateProps from './use-shared-state-props';
import useFuncProps from './use-func-props';
import useSharedStateMutationProps from './use-shared-state-mutation';
import useInternalHookProps from './use-internal-hook-props';
import useRenderProps from './use-render-props';
import useComputedProps from './use-computed-props';
import PathContext from '../node-render/path-context';
import { convertPath } from './utils';
import useInheritProps from './use-inherit-props';

function useInstantiateProps(node: SchemaNode, ctx: CTX): Record<string, unknown> {
  const currentPath = useContext(PathContext);
  const nodePath = convertPath(currentPath);
  const nodeID = nodePath.split('/').pop() || node.id;

  const constantProps = useConstantProps(node);
  const apiResultProps = useAPIResultProps(node, ctx);
  const apiLoadingProps = useAPILoadingProps(node, ctx);
  const sharedStateProps = useSharedStateProps(node, ctx);
  const internalHookProps = useInternalHookProps(node, ctx);
  const computedProps = useComputedProps(node, ctx);
  const inheritProps = useInheritProps(node, ctx);
  const funcProps = useFuncProps(node);

  const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
  const apiStateInvokeProps = useAPIInvokeProps(node, ctx);
  const renderProps = useRenderProps(node, ctx);

  return useMemo(() => {
    const instantiateProps = Object.assign(
      constantProps,
      apiStateInvokeProps,
      apiResultProps,
      apiLoadingProps,
      sharedStateProps,
      funcProps,
      sharedStateMutationProps,
      internalHookProps,
      renderProps,
      computedProps,
      inheritProps,
    );

    Object.entries(instantiateProps).forEach(([key, prop]) => {
      if(ctx.nodePropsCache.hasCacheKey(`${nodeID}.${key}`)) {
        ctx.nodePropsCache.setProps(`${nodeID}.${key}`, prop);
      }
    });

    return instantiateProps;
  }, [apiResultProps, sharedStateProps, apiLoadingProps, computedProps, constantProps]);
}

export default useInstantiateProps;
