import { logger } from '@ofa/utils';

import {
  SchemaNode,
  Serialized,
  Instantiated,
  CTX,
  NodeType,
} from '../types';

import { transformLoopNodeProps, transformProps } from './transform-props';

function transformNode(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> {
  if (node.type === NodeType.LoopContainerNode) {
    return {
      ...node,
      props: transformLoopNodeProps(node.props, ctx),
    };
  }

  const children = (node.children || []).map((n) => transformNode(n, ctx));

  return {
    ...node,
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
