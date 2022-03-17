import { logger } from '@one-for-all/utils';
import { RenderEngineCTX } from '../../types';

import instantiate from './instantiate';

function deserialize(n: unknown, ctx: RenderEngineCTX | undefined): unknown | null {
  try {
    return instantiate(JSON.parse(JSON.stringify(n)), ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserialize;
