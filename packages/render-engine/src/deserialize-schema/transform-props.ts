import { logger } from '@ofa/utils';

import {
  NodeProperty,
  NodeProperties,
  Serialized,
  Instantiated,
  NodePropType,
  IterableState,
  FunctionalProperty,
  CTX,
  LoopContainerNode,
} from '../types';
import deserializeSchema from './index';
import { instantiateConvertor, instantiateFuncSpec } from './utils';

export function transformLoopNode(
  node: LoopContainerNode<Serialized>,
  ctx: CTX,
): LoopContainerNode<Instantiated> {
  const { iterableState, toProps } = transformProps({
    iterableState: node.iterableState,
    toProps: node.toProps,
  }, ctx);

  const instantiatedNode = deserializeSchema(node.node, ctx);
  if (!instantiatedNode) {
    throw new Error('failed to deserialize loop node schema');
  }

  return {
    key: node.key,
    type: node.type,
    props: node.props ? transformProps(node.props, ctx) : {},
    // todo fixme
    iterableState: iterableState as IterableState<Instantiated>,
    // todo fixme
    toProps: toProps as FunctionalProperty<Instantiated>,
    loopKey: node.loopKey,
    node: instantiatedNode,
  };
}

export function transformProps(props: NodeProperties<Serialized>, ctx: CTX): NodeProperties<Instantiated> {
  return Object.entries(props).map<[string, NodeProperty<Instantiated>] | null>(([propName, propDesc]) => {
    // instantiate Array<APIInvokeProperty<T>>
    // if (Array.isArray(propDesc)) {
    //   return [
    //     propName,
    //     propDesc.map(({ type, stateID, paramsBuilder, onSuccess, onError }) => {
    //       return {
    //         type,
    //         stateID,
    //         paramsBuilder: paramsBuilder ? instantiateFuncSpec(paramsBuilder, ctx) : undefined,
    //         onSuccess: onSuccess ? instantiateFuncSpec(onSuccess, ctx) : undefined,
    //         onError: onError ? instantiateFuncSpec(onError, ctx) : undefined,
    //       };
    //     }),
    //   ];
    // }

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
