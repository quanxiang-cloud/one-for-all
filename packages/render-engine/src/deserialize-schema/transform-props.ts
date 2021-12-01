import { logger } from '@ofa/utils';

import {
  NodeProperty,
  NodeProperties,
  Serialized,
  Instantiated,
  NodePropType,
  IterableState,
  FunctionalProperty,
  LoopContainerNodeProps,
  CTX,
} from '../types';
import deserializeSchema from './index';
import { instantiateConvertor, instantiateFuncSpec } from './utils';

export function transformLoopNodeProps(
  props: LoopContainerNodeProps<Serialized>,
  ctx: CTX,
): LoopContainerNodeProps<Instantiated> {
  const {
    instantiatedIterableState,
    instantiatedToProps,
  } = transformProps({
    instantiatedIterableState: props.iterableState,
    instantiatedToProps: props.toProps,
  }, ctx);

  const instantiatedNode = deserializeSchema(props.node.value, ctx);
  // todo refactor this
  if (!instantiatedNode) {
    throw new Error('failed to deserialize loop node schema');
  }

  return {
    iterableState: instantiatedIterableState as IterableState<Instantiated>,
    loopKey: props.loopKey,
    node: {
      type: NodePropType.ConstantProperty,
      // todo fixme
      value: instantiatedNode,
    },
    // todo fixme
    toProps: instantiatedToProps as FunctionalProperty<Instantiated>,
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
