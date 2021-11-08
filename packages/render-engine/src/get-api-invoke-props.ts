import { logger } from '@ofa/utils';

import { APIInvokeProperty, CTX, Instantiated } from './types';

type APICallProps = Record<string, (...args: any[]) => void>;

export default function getAPIInvokeProps(
  props: Record<string, APIInvokeProperty<Instantiated>[]>,
  ctx: CTX,
): APICallProps {
  return Object.entries(props)
    .reduce<APICallProps>((acc, [propName, apiCalls]) => {
      function handleAction(...args: any[]): void {
        apiCalls.forEach(({ stateID, paramsBuilder, onError, onSuccess }) => {
          const run = ctx.apiStateContext.getAction(stateID);
          try {
            const requestParams = paramsBuilder?.(...args);
            run({ params: requestParams, onError, onSuccess });
          } catch (error) {
            logger.log('failed to run convertor or run action:', error);
          }
        });
      }

      acc[propName] = handleAction;
      return acc;
    }, {});
}
