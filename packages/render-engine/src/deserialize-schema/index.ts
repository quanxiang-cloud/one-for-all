import { logger } from '@one-for-all/utils';
import type * as SchemaSpec from '@one-for-all/schema-spec';

import type { SchemaNode, RenderEngineCTX } from '../types';
import deserialize from './deserialize';

function deserializeSchema(node: SchemaSpec.SchemaNode, ctx: RenderEngineCTX): SchemaNode | null {
  try {
    const _node = JSON.parse(JSON.stringify(node));
    deserialize(_node, ctx);
    return _node as SchemaNode;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserializeSchema;
