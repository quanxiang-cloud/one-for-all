import { useState, useEffect } from 'react';
import StateHub from './state-hub';
import { APIInvokeProperty } from './types';

type Props = {
  props: Record<string, APIInvokeProperty>;
  stateHub: StateHub;
}

type APICallProps = Record<string, (...args: any[]) => void>;

export default function useAPICallProps({ props, stateHub }: Props): APICallProps {
  const [actionProps, setActionProps] = useState<APICallProps>({});
  useEffect(() => {
    const _actionProps = Object.entries(props)
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
    setActionProps(_actionProps);
  }, []);

  console.log('actionProps', actionProps)

  return actionProps;
}
