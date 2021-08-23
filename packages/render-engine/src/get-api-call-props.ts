// import logger from '@ofa/utils/src/logger';

import StateHub from './state-hub';
import { APIInvokeProperty } from './types';

type APICallProps = Record<string, (...args: any[]) => void>;

export default function getAPICallProps(
  props: Record<string, APIInvokeProperty>,
  stateHub: StateHub,
): APICallProps {
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
