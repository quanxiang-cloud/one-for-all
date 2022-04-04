import { useMemo, useContext } from 'react';

import { CTX, ArteryNode } from '../types';
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
import useInheritedProps from './use-inherited-props';
import useLinkProps from './use-link-props';

function useInstantiateProps(node: ArteryNode, ctx: CTX): Record<string, unknown> {
  const currentPath = useContext(PathContext);

  const constantProps = useConstantProps(node);
  const apiResultProps = useAPIResultProps(node, ctx);
  const apiLoadingProps = useAPILoadingProps(node, ctx);
  const sharedStateProps = useSharedStateProps(node, ctx);
  const internalHookProps = useInternalHookProps(node, ctx);
  const computedProps = useComputedProps(node, ctx);
  const inheritedProps = useInheritedProps(node, ctx);
  const funcProps = useFuncProps(node);

  const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
  const apiStateInvokeProps = useAPIInvokeProps(node, ctx);
  const renderProps = useRenderProps(node, ctx);

  // todo support user defined onClick event
  const linkProps = useLinkProps(node, ctx);

  return useMemo(() => {
    const instantiateProps = Object.assign(
      constantProps,
      apiStateInvokeProps,
      apiResultProps,
      apiLoadingProps,
      sharedStateProps,
      computedProps,
      sharedStateMutationProps,
      internalHookProps,
      renderProps,
      linkProps,
      inheritedProps,
    );

    ctx.nodePropsCache?.setProps(currentPath, node.id, instantiateProps);

    return Object.assign(instantiateProps, funcProps);
  }, [apiResultProps, sharedStateProps, apiLoadingProps, computedProps, constantProps]);
}

export default useInstantiateProps;
