import { useMemo } from 'react';

import {
  ConstantProperty,
  Instantiated,
  CTX,
  NodePropType,
  SchemaNode,
} from '../types';
import useAPIStateDerivedProps from './use-api-state-derived-props';
import getAPIInvokeProps from './get-api-invoke-props';
import useSharedStateProps from './use-shared-state-props';
import { useFuncProps } from './use-func-props';
import useSharedStateMutationProps from './use-shared-state-mutation';
import useInternalHookProps from './use-internal-hook-props';
import useNodeStateProps from './use-node-state-props';

function useConstantProps(node: SchemaNode<Instantiated>): Record<string, any> {
  return useMemo(() => {
    return Object.entries(node.props).filter((pair): pair is [string, ConstantProperty] => {
      return pair[1].type === NodePropType.ConstantProperty;
    }).reduce<Record<string, any>>((acc, [key, { value }]) => {
      acc[key] = value;
      return acc;
    }, {});
  }, []);
}

function useInstantiateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const constantProps = useConstantProps(node);
  const apiStateInvokeProps = getAPIInvokeProps(node, ctx);
  const derivedProps = useAPIStateDerivedProps(node, ctx);
  const sharedStateProps = useSharedStateProps(node, ctx);
  const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
  const internalHookProps = useInternalHookProps(node, ctx);
  const nodeStateProps = useNodeStateProps(node, ctx);
  const funcProps = useFuncProps(node);

  return useMemo(() => {
    return Object.assign(
      constantProps,
      apiStateInvokeProps,
      derivedProps,
      sharedStateProps,
      funcProps,
      sharedStateMutationProps,
      internalHookProps,
      nodeStateProps,
    );
  }, [derivedProps, sharedStateProps, nodeStateProps]);
}

export default useInstantiateProps;
