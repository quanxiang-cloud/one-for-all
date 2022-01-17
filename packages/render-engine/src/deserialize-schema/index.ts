import { logger } from '@ofa/utils';

import type { SchemaNode, Serialized, Instantiated, CTX } from '../types';
import deserialize from './deserialize';

function deserializeSchema(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> | null {
  try {
    deserialize(node, ctx);
    return node as SchemaNode<Instantiated>;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserializeSchema;
