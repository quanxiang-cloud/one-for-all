import { useState, useMemo } from 'react';
import useStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, APIDerivedProperty, ConstantProperty, NodeProps, Instantiated } from './types';
import StateHub from './state-hub';
import getAPICallProps from './get-api-invoke-props';

type Props = {
  props: NodeProps<Instantiated>;
  stateHub: StateHub;
}

type GroupedProps = {
  apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>>;
  apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]>;
  constantProps: Record<string, any>;
}

function groupProps(props: NodeProps<Instantiated>): GroupedProps {
  const apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>> = {};
  const apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]> = {};
  const constantProps: Record<string, ConstantProperty> = {};
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
  });

  return { apiDerivedProps, apiInvokeProps, constantProps };
}

export default function useAPIState({ props, stateHub }: Props): Record<string, any> {
  const { apiDerivedProps, apiInvokeProps, constantProps } = groupProps(props);
  const [apiStateProps] = useState<Record<string, any>>(
    () => getAPICallProps(apiInvokeProps, stateHub),
  );
  const derivedProps = useStateDerivedProps({ props: apiDerivedProps, stateHub });

  return useMemo(() => Object.assign(constantProps, apiStateProps, derivedProps), [derivedProps]);
}
