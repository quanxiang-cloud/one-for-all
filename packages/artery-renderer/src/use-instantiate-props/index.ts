import { useMemo, useContext } from 'react';

import { ArteryNode } from '../types';
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
import useCTX from '../use-ctx';

function useInstantiateProps(node: ArteryNode): Record<string, unknown> {
  const ctx = useCTX();
  const currentPath = useContext(PathContext);

  const constantProps = useConstantProps(node);
  const apiResultProps = useAPIResultProps(node);
  const apiLoadingProps = useAPILoadingProps(node);
  const sharedStateProps = useSharedStateProps(node);
  const internalHookProps = useInternalHookProps(node);
  const computedProps = useComputedProps(node);
  const inheritedProps = useInheritedProps(node);
  const funcProps = useFuncProps(node);

  const sharedStateMutationProps = useSharedStateMutationProps(node);
  const apiStateInvokeProps = useAPIInvokeProps(node);
  const renderProps = useRenderProps(node);

  // todo support user defined onClick event
  const linkProps = useLinkProps(node);

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
