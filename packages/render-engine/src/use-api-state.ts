import { useState } from 'react';
import useStateDerivedProps from './use-api-state-derived-props';
import { APIInvokeProperty, ResultDerivedProperty } from './types';
import StateHub from './state-hub';

type Props = {
  props: Record<string, APIInvokeProperty | ResultDerivedProperty>;
  stateHub: StateHub;
}

type APICallProps = Record<string, (...args: any[]) => void>;

function groupProps(
  props: Record<string, APIInvokeProperty | ResultDerivedProperty>,
): [Record<string, ResultDerivedProperty>, Record<string, APIInvokeProperty>] {
  const apiDerivedProps: Record<string, ResultDerivedProperty> = {};
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

function getAPICallProps(props: Record<string, APIInvokeProperty>, stateHub: StateHub): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, { stateID, convertor, onError, onSuccess }]) => {
      const run = stateHub.getAction(stateID);
      function handleAction(...args: any[]): void {
        try {
          const requestParams = convertor(...args);
          run({ params: requestParams, onError, onSuccess });
        } catch (error) {
          console.log('failed to run convertor or run action:', error);
        }
      }

      acc[propName] = handleAction;
      return acc;
    }, {});
}

export default function useAPIState({ props, stateHub }: Props): Record<string, any> {
  const [apiDerivedProps, apiInvokeProps] = groupProps(props);
  const [apiStateProps] = useState<Record<string, any>>(
    () => getAPICallProps(apiInvokeProps, stateHub),
  );
  const derivedProps = useStateDerivedProps({ props: apiDerivedProps, stateHub });
  return Object.assign(apiStateProps, derivedProps);
}
