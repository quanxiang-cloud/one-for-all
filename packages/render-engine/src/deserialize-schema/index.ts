import { logger } from '@ofa/utils';

import type { SchemaNode, Serialized, Instantiated, CTX } from '../types';
import { transformNode } from './transform';

function deserializeSchema(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> | null {
  try {
    return transformNode(node, ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserializeSchema;
