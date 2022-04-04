import { logger } from '@one-for-all/utils';
import { ArteryRendererCTX } from '../../types';

import instantiate from './instantiate';

function deserialize(n: unknown, ctx: ArteryRendererCTX | undefined): unknown | null {
  try {
    return instantiate(JSON.parse(JSON.stringify(n)), ctx);
  } catch (error) {
    logger.error('deserialize failed:', error);
    return null;
  }
}

export default deserialize;
