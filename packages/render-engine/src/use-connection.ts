import { useState, useMemo } from 'react';
import useAPIStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, APIDerivedProperty, ConstantProperty, NodeProperties, Instantiated, LocalStateProperty, SetLocalStateProperty } from './types';
import APIStateHub from './api-state-hub';
import getAPIInvokeProps from './get-api-invoke-props';

type GroupedProps = {
  apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>>;
  apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]>;
  constantProps: Record<string, any>;
  localStateProps: Record<string, LocalStateProperty<Instantiated>>;
  setLocalStateProps: Record<string, SetLocalStateProperty<Instantiated>>;
}

function groupProps(props: NodeProperties<Instantiated>): GroupedProps {
  const apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>> = {};
  const apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]> = {};
  const constantProps: Record<string, ConstantProperty> = {};
  const localStateProps: Record<string, LocalStateProperty<Instantiated>> = {};
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

    if (propDesc.type === 'api_invoke_property') {
      if (!apiInvokeProps[propName]) {
        apiInvokeProps[propName] = [];
      }
      apiInvokeProps[propName].push(propDesc);
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

    if (propDesc.type === 'set_local_state_property') {
      setLocalStateProps[propName] = propDesc;
    }
  });

  return { apiDerivedProps, apiInvokeProps, constantProps, localStateProps, setLocalStateProps };
}

type Props = {
  nodeProps: NodeProperties<Instantiated>;
  apiStateHub: APIStateHub;
}

export default function useConnection({ nodeProps, apiStateHub }: Props): Record<string, any> {
  const { apiDerivedProps, apiInvokeProps, constantProps, localStateProps, setLocalStateProps } = groupProps(nodeProps);
  const [apiStateProps] = useState<Record<string, any>>(() => getAPIInvokeProps(apiInvokeProps, apiStateHub));
  const derivedProps = useAPIStateDerivedProps({ props: apiDerivedProps, apiStateHub });

  return useMemo(() => Object.assign(constantProps, apiStateProps, derivedProps), [derivedProps]);
}
