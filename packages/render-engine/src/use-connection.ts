import { useState, useMemo } from 'react';
import useAPIStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, APIDerivedProperty, ConstantProperty, NodeProperties, Instantiated } from './types';
import APIStateHub from './api-state-hub';
import getAPIInvokeProps from './get-api-invoke-props';

type GroupedProps = {
  apiDerivedProps: Record<string, APIDerivedProperty<Instantiated>>;
  apiInvokeProps: Record<string, APIInvokeProperty<Instantiated>[]>;
  constantProps: Record<string, any>;
}

function groupProps(props: NodeProperties<Instantiated>): GroupedProps {
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

type Props = {
  nodeProps: NodeProperties<Instantiated>;
  stateHub: APIStateHub;
}

export default function useConnection({ nodeProps, stateHub }: Props): Record<string, any> {
  const { apiDerivedProps, apiInvokeProps, constantProps } = groupProps(nodeProps);
  const [apiStateProps] = useState<Record<string, any>>(() => getAPIInvokeProps(apiInvokeProps, stateHub));
  const derivedProps = useAPIStateDerivedProps({ props: apiDerivedProps, stateHub });

  return useMemo(() => Object.assign(constantProps, apiStateProps, derivedProps), [derivedProps]);
}
