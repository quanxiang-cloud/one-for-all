import { useState, useMemo } from 'react';
import useAPIStateDerivedProps from './use-api-state-derived-props';
import {
  APIInvokeProperty,
  APIDerivedProperty,
  ConstantProperty,
  NodeProperties,
  Instantiated,
  LocalStateProperty,
  SetLocalStateProperty,
  CTX,
  FunctionalProperty,
  ComponentPropType,
} from './types';
import getAPIInvokeProps from './get-api-invoke-props';
import { useLocalStateProps } from './use-local-state';
import { useFuncProps } from './use-func-props';

type GroupedProps = {
  constantProps: Record<string, any>;
  apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>>;
  localStateProps: Record<string, LocalStateProperty<Instantiated>>;
  functionalProps: Record<string, FunctionalProperty<Instantiated>>;
  apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]>;
  setLocalStateProps: Record<string, SetLocalStateProperty<Instantiated>>;
}

function groupProps(props: NodeProperties<Instantiated>): GroupedProps {
  const constantProps: Record<string, ConstantProperty> = {};
  const apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>> = {};
  const localStateProps: Record<string, LocalStateProperty<Instantiated>> = {};
  const functionalProps: Record<string, FunctionalProperty<Instantiated>> = {};
  const apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]> = {};
  const setLocalStateProps: Record<string, SetLocalStateProperty<Instantiated>> = {};

  Object.entries(props).forEach(([propName, propDesc]) => {
    if (Array.isArray(propDesc)) {
      apiInvokeProps[propName] = propDesc;
      return;
    }

    if (propDesc.type === 'constant_property') {
      constantProps[propName] = propDesc.value;
      return;
    }

    if (propDesc.type === 'api_derived_property') {
      apiDerivedProps[propName] = propDesc;
      return;
    }

    if (propDesc.type === 'local_state_property') {
      localStateProps[propName] = propDesc;
      return;
    }

    if (propDesc.type === ComponentPropType.FunctionalProperty) {
      functionalProps[propName] = propDesc;
      return;
    }

    if (propDesc.type === 'api_invoke_property') {
      if (!apiInvokeProps[propName]) {
        apiInvokeProps[propName] = [];
      }
      apiInvokeProps[propName].push(propDesc);
      return;
    }

    if (propDesc.type === 'set_local_state_property') {
      setLocalStateProps[propName] = propDesc;
    }
  });

  return {
    constantProps,
    apiDerivedProps,
    localStateProps,
    functionalProps,
    apiInvokeProps,
    setLocalStateProps,
  };
}

type Props = {
  nodeProps: NodeProperties<Instantiated>;
  ctx: CTX;
}

export default function useConnection({ nodeProps, ctx }: Props): Record<string, any> {
  const {
    constantProps,
    apiDerivedProps,
    localStateProps,
    functionalProps,
    apiInvokeProps,
  } = groupProps(nodeProps);

  const [apiStateInvokeProps] = useState<Record<string, any>>(() => getAPIInvokeProps(apiInvokeProps, ctx));
  const derivedProps = useAPIStateDerivedProps({ props: apiDerivedProps, ctx });
  const localValueProps = useLocalStateProps({ props: localStateProps, ctx });
  const funcProps = useFuncProps({ props: functionalProps, ctx });

  return useMemo(() => {
    return Object.assign(constantProps, apiStateInvokeProps, derivedProps, localValueProps, funcProps);
  }, [derivedProps, localValueProps]);
}
