// import logger from '@ofa/utils/src/logger';

import StateHub from './state-hub';
import { APIInvokeProperty, Instantiated } from './types';

type APICallProps = Record<string, (...args: any[]) => void>;

export default function getAPICallProps(
  props: Record<string, APIInvokeProperty<Instantiated>[]>,
  stateHub: StateHub,
): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, apiCalls]) => {
      function handleAction(...args: any[]): void {
        apiCalls.forEach(({ stateID, paramsBuilder, onError, onSuccess }) => {
          const run = stateHub.getAction(stateID);
          try {
            const requestParams = paramsBuilder?.(...args);
            run({ params: requestParams, onError, onSuccess });
          } catch (error) {
            console.log('failed to run convertor or run action:', error);
          }
        });
      }

      acc[propName] = handleAction;
      return acc;
    }, {});
}
