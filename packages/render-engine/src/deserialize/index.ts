import { logger } from '@one-for-all/utils';

import instantiate from './instantiate';

function deserialize(n: unknown, ctx: unknown): unknown | null {
  try {
    return instantiate(JSON.parse(JSON.stringify(n)), ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserialize;
