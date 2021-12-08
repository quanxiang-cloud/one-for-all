import { logger } from '@ofa/utils';

import {
  SchemaNode,
  Serialized,
  Instantiated,
  CTX,
  NodeType,
} from '../types';

import { transformLoopNode, transformProps } from './transform-props';
import { instantiateLifecycleHook } from './utils';

function transformNode(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> {
  if (node.type === NodeType.LoopContainerNode) {
    return transformLoopNode(node, ctx);
  }

  const children = (node.children || []).map((n) => transformNode(n, ctx));

  return {
    ...node,
    lifecycleHooks: node.lifecycleHooks ? instantiateLifecycleHook(node.lifecycleHooks, ctx) : undefined,
    children,
    props: transformProps(node.props || {}, ctx),
  };
}

function deserializeSchema(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> | null {
  try {
    return transformNode(node, ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export default deserializeSchema;
