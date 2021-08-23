import { useState, useMemo } from 'react';
import useStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, APIDerivedProperty, ConstantProperty } from './types';
import StateHub from './state-hub';
import getAPICallProps from './get-api-call-props';

type Props = {
  props: Record<string, ConstantProperty | APIDerivedProperty | APIInvokeProperty>;
  stateHub: StateHub;
}

function groupProps(
  props: Record<string, ConstantProperty | APIInvokeProperty | APIDerivedProperty>,
): {
  apiDerivedProps: Record<string, APIDerivedProperty>;
  apiInvokeProps: Record<string, APIInvokeProperty>;
  constantProps: Record<string, any>;
} {
  const apiDerivedProps: Record<string, APIDerivedProperty> = {};
  const apiInvokeProps: Record<string, APIInvokeProperty> = {};
  const constantProps: Record<string, ConstantProperty> = {};
  Object.entries(props).forEach(([propName, propDesc]) => {
    if (propDesc.type === 'constant_property') {
      constantProps[propName] = propDesc.value;
      return;
    }

    if (propDesc.type === 'api_invoke_property') {
      apiInvokeProps[propName] = propDesc;
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
