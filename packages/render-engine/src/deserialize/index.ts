import { logger } from '@one-for-all/utils';

import instantiate from './instantiate';
import parseInheritProperty from './parse-inherit-property';

function deserialize(n: unknown, ctx: unknown): unknown | null {
  try {
    const _n = JSON.parse(JSON.stringify(n));
    const __n = parseInheritProperty(_n, [], ctx);
    return instantiate(__n, ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserialize;
