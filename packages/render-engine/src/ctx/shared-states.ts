import { logger } from '@ofa/utils';
import SharedStateHub from './states-hub-shared';

function getSharedStates(statesHubShared: SharedStateHub): Record<string, unknown> {
  const handler: ProxyHandler<Readonly<Record<string, unknown>>> = {
    get: (target: ProxyHandler<Readonly<Record<string, unknown>>>, p: string): unknown => {
      return statesHubShared.getState(p);
    },

    set: (target: ProxyHandler<Readonly<Record<string, unknown>>>, p: string, value: unknown): boolean => {
      if (p.startsWith('$')) {
        logger.error('node internal state can not be assigned');
        return false;
      }

      statesHubShared.mutateState(p, value);

      return true;
    },
  };

  return new Proxy<Record<string, unknown>>({}, handler);
}

export default getSharedStates;
