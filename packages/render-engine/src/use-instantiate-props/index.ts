import { useMemo } from 'react';

import {
  Instantiated,
  CTX,
  SchemaNode,
} from '../types';
import useConstantProps from './use-constant-props';
import useAPIResultProps from './use-api-result-props';
import useAPILoadingProps from './use-api-loading-props';
import useAPIInvokeProps from './use-api-invoke-props';
import useSharedStateProps from './use-shared-state-props';
import useFuncProps from './use-func-props';
import useSharedStateMutationProps from './use-shared-state-mutation';
import useInternalHookProps from './use-internal-hook-props';

function useInstantiateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, unknown> {
  const constantProps = useConstantProps(node);
  const apiResultProps = useAPIResultProps(node, ctx);
  const apiLoadingProps = useAPILoadingProps(node, ctx);
  const sharedStateProps = useSharedStateProps(node, ctx);
  const internalHookProps = useInternalHookProps(node, ctx);
  const funcProps = useFuncProps(node);

  const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
  const apiStateInvokeProps = useAPIInvokeProps(node, ctx);

  return useMemo(() => {
    return Object.assign(
      constantProps,
      apiStateInvokeProps,
      apiResultProps,
      apiLoadingProps,
      sharedStateProps,
      funcProps,
      sharedStateMutationProps,
      internalHookProps,
    );
  }, [apiResultProps, sharedStateProps, apiLoadingProps]);
}

export default useInstantiateProps;
