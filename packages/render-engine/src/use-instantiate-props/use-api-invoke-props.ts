import { useMemo } from 'react';
import { FetchParams } from '@ofa/api-spec-adapter';
import { logger } from '@ofa/utils';

import { APIInvokeProperty, CTX, SchemaNode } from '../types';

type APICallProps = Record<string, (...args: unknown[]) => void>;

export default function useAPIInvokeProps(node: SchemaNode, ctx: CTX): APICallProps {
  logger.warn('hook useAPIInvokeProps has been deprecated, please use hook useFuncProps instead');

  return useMemo(() => {
    if (!node.props) {
      return {};
    }

    return Object.entries(node.props).filter((pair): pair is [string, APIInvokeProperty] => {
      return pair[1].type === 'api_invoke_property';
    }).reduce<APICallProps>((acc, [propName, { stateID, paramsBuilder, callback }]) => {
      function handleAction(...args: unknown[]): void {
        try {
          const fetchParams: FetchParams = paramsBuilder?.(...args) || {};
          ctx.apiStates[stateID].fetch(fetchParams, callback);
        } catch (error) {
          logger.log('failed to run convertor or run action:', error);
        }
      }

      acc[propName] = handleAction;
      return acc;
    }, {});
  }, []);
}
