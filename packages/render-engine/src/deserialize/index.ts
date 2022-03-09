import { logger } from '@one-for-all/utils';

import instantiate from './instantiate';
import parseInheritProperty from './parse-inherit-property';
import NodePropsCache from '../ctx/node-props-cache';
import { CTX } from '../types';

function deserialize(n: unknown, ctx: unknown): unknown | null {
  try {
    const _n = JSON.parse(JSON.stringify(n));
    const cacheIDs = parseInheritProperty(_n, 'ROOT', new Set());
    if(ctx) {
      (ctx as CTX).nodePropsCache = new NodePropsCache(cacheIDs);
    }

    return instantiate(_n, ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserialize;
