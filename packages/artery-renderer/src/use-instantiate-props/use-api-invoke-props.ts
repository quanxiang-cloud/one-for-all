import { useMemo } from 'react';
import { FetchParams } from '@one-for-all/api-spec-adapter';
import { logger } from '@one-for-all/utils';

import { APIInvokeProperty, CTX, ArteryNode } from '../types';

type APICallProps = Record<string, (...args: unknown[]) => void>;

export default function useAPIInvokeProps(node: ArteryNode, ctx: CTX): APICallProps {
  return useMemo(() => {
    if (!node.props) {
      return {};
    }

    return Object.entries(node.props)
      .filter((pair): pair is [string, APIInvokeProperty] => {
        return pair[1].type === 'api_invoke_property';
      })
      .reduce<APICallProps>((acc, [propName, { stateID, paramsBuilder, callback }]) => {
        logger.warn('hook useAPIInvokeProps has been deprecated, please use hook useFuncProps instead');

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
