import { useState } from 'react';
import useStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, APIDerivedProperty } from './types';
import StateHub from './state-hub';
import getAPICallProps from './get-api-call-props';

type Props = {
  props: Record<string, APIInvokeProperty | APIDerivedProperty>;
  stateHub: StateHub;
}

function groupProps(
  props: Record<string, APIInvokeProperty | APIDerivedProperty>,
): [Record<string, APIDerivedProperty>, Record<string, APIInvokeProperty>] {
  const apiDerivedProps: Record<string, APIDerivedProperty> = {};
  const apiInvokeProps: Record<string, APIInvokeProperty> = {};
  Object.entries(props).forEach(([propName, propDesc]) => {
    if (propDesc.type === 'api_invoke_property') {
      apiInvokeProps[propName] = propDesc;
      return;
    }

    apiDerivedProps[propName] = propDesc;
  });

  return [apiDerivedProps, apiInvokeProps];
}

export default function useAPIState({ props, stateHub }: Props): Record<string, any> {
  const [apiDerivedProps, apiInvokeProps] = groupProps(props);
  const [apiStateProps] = useState<Record<string, any>>(
    () => getAPICallProps(apiInvokeProps, stateHub),
  );
  const derivedProps = useStateDerivedProps({ props: apiDerivedProps, stateHub });
  return Object.assign(apiStateProps, derivedProps);
}
