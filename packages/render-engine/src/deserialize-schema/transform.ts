import { logger } from '@ofa/utils';

import {
  CTX,
  Instantiated,
  LoopContainerNode,
  NodeProperties,
  NodeProperty,
  NodePropType,
  NodeType,
  PlainState,
  RefNode,
  SchemaNode,
  Serialized,
} from '../types';
import deserializeSchema from './index';
import { instantiateConvertor, instantiateFuncSpec, instantiateLifecycleHook } from './utils';

export function transformLoopNode(
  node: LoopContainerNode<Serialized>,
  ctx: CTX,
): LoopContainerNode<Instantiated> {
  const { iterableState } = transformProps({ iterableState: node.iterableState }, ctx);
  const instantiatedToProps = instantiateFuncSpec<Record<string, unknown>>(node.toProps, ctx);
  const instantiatedNode = deserializeSchema(node.node, ctx);
  if (!instantiatedNode) {
    throw new Error('failed to deserialize loop node schema');
  }

  return {
    id: node.id,
    type: node.type,
    props: node.props ? transformProps(node.props, ctx) : {},
    // todo fixme
    iterableState: iterableState as PlainState<Instantiated>,
    toProps: instantiatedToProps,
    loopKey: node.loopKey,
    node: instantiatedNode,
  };
}

export function transformRefNode(node: RefNode<Serialized>, ctx: CTX): RefNode<Instantiated> {
  if (!node.fallback) {
    return { id: node.id, type: NodeType.RefNode, schemaID: node.schemaID };
  }

  return {
    id: node.id,
    type: NodeType.RefNode,
    schemaID: node.schemaID,
    fallback: transformNode(node.fallback, ctx),
  };
}

export function transformNode(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> {
  if (node.type === NodeType.LoopContainerNode) {
    return transformLoopNode(node, ctx);
  }

  if (node.type === NodeType.ComposedNode) {
    throw new Error('unimplemented');
  }

  if (node.type === NodeType.RefNode) {
    return transformRefNode(node, ctx);
  }

  const children = (node.children || []).map((n) => transformNode(n, ctx));

  return {
    ...node,
    lifecycleHooks: node.lifecycleHooks ? instantiateLifecycleHook(node.lifecycleHooks, ctx) : undefined,
    children,
    props: transformProps(node.props || {}, ctx),
  };
}

export function transformProps(props: NodeProperties<Serialized>, ctx: CTX): NodeProperties<Instantiated> {
  return Object.entries(props).map<[string, NodeProperty<Instantiated>] | null>(([propName, propDesc]) => {
    if (
      propDesc.type === NodePropType.ConstantProperty ||
      propDesc.type === NodePropType.APILoadingProperty
    ) {
      return [propName, propDesc];
    }

    if (
      propDesc.type === NodePropType.APIResultProperty ||
      propDesc.type === NodePropType.SharedStateProperty ||
      propDesc.type === NodePropType.NodeStateProperty
    ) {
      return [
        propName,
        {
          ...propDesc,
          convertor: propDesc.convertor ? instantiateConvertor(propDesc.convertor, ctx) : undefined,
        },
      ];
    }

    if (propDesc.type === NodePropType.APIInvokeProperty) {
      return [propName, {
        ...propDesc,
        paramsBuilder: propDesc.paramsBuilder ? instantiateFuncSpec(propDesc.paramsBuilder, ctx) : undefined,
        callback: propDesc.callback ? instantiateFuncSpec(propDesc.callback, ctx) : undefined,
      }];
    }

    if (propDesc.type === NodePropType.SharedStateMutationProperty) {
      return [
        propName,
        {
          type: propDesc.type,
          stateID: propDesc.stateID,
          convertor: propDesc.convertor ? instantiateFuncSpec(propDesc.convertor, ctx) : undefined,
        },
      ];
    }

    if (propDesc.type === NodePropType.FunctionalProperty) {
      const func = instantiateFuncSpec(propDesc.func, ctx);
      if (!func) {
        // todo log error message
        return null;
      }

      return [
        propName,
        {
          type: NodePropType.FunctionalProperty,
          func: func,
        },
      ];
    }

    logger.warn('unsupported property:', propDesc);

    return null;
  }).filter((pair): pair is [string, NodeProperty<Instantiated>] => {
    return !!pair;
  }).reduce<NodeProperties<Instantiated>>((acc, [propName, propDesc]) => {
    acc[propName] = propDesc;
    return acc;
  }, {});
}
