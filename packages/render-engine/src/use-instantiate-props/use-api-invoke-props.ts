import { useMemo } from 'react';
import { logger } from '@ofa/utils';

import { APIInvokeProperty, CTX, Instantiated, NodePropType, SchemaNode } from '../types';

type APICallProps = Record<string, (...args: any[]) => void>;

export default function useAPIInvokeProps(node: SchemaNode<Instantiated>, ctx: CTX): APICallProps {
  return useMemo(() => {
    return Object.entries(node.props).filter((pair): pair is [string, APIInvokeProperty<Instantiated>] => {
      return pair[1].type === NodePropType.APIInvokeProperty;
    }).reduce<APICallProps>((acc, [propName, { stateID, paramsBuilder, onError, onSuccess }]) => {
      function handleAction(...args: any[]): void {
        try {
          const requestParams = paramsBuilder?.(...args);
          ctx.apiStates.runAction(stateID, { params: requestParams, onError, onSuccess });
        } catch (error) {
          logger.log('failed to run convertor or run action:', error);
        }
      }

      acc[propName] = handleAction;
      return acc;
    }, {});
  }, []);
}
