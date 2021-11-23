import { logger } from '@ofa/utils';
import SharedStateHub from './states-hub-shared';

function getSharedStates(statesHubShared: SharedStateHub): Record<string, any> {
  const handler: ProxyHandler<Readonly<Record<string, any>>> = {
    get: (target: ProxyHandler<Readonly<Record<string, any>>>, p: string): any => {
      return statesHubShared.getState(p);
    },

    set: (target: ProxyHandler<Readonly<Record<string, any>>>, p: string, value: any): boolean => {
      if (p.startsWith('$')) {
        logger.error('node internal state can not be assigned');
        return false;
      }

      statesHubShared.mutateState(p, value);

      return true;
    },
  };

  return new Proxy<Record<string, any>>({}, handler);
}

export default getSharedStates;
