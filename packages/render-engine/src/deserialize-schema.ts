import { noop } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  NodeProperty,
  SchemaNode,
  NodeProperties,
  Serialized,
  Instantiated,
  NodePropType,
  BaseFunctionSpec,
  StateConvertorFunc,
  CTX,
  SerializedStateConvertor,
} from './types';
import { VersatileFunc } from '.';

function instantiateConvertor(
  serializedStateConvertor: SerializedStateConvertor,
  ctx: CTX,
): StateConvertorFunc {
  if (serializedStateConvertor.type === 'state_convert_expression') {
    return new Function('state', `return ${serializedStateConvertor.expression}`).bind(ctx);
  }

  if (serializedStateConvertor.type === 'state_convertor_func_spec') {
    return new Function('state', serializedStateConvertor.body).bind(ctx);
  }

  return noop;
}

function instantiateFuncSpec(spec: BaseFunctionSpec, ctx: CTX): VersatileFunc {
  return new Function(spec.args, spec.body).bind(ctx);
}

function transformProps(props: NodeProperties<Serialized>, ctx: CTX): NodeProperties<Instantiated> {
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
        onSuccess: propDesc.onSuccess ? instantiateFuncSpec(propDesc.onSuccess, ctx) : undefined,
        onError: propDesc.onError ? instantiateFuncSpec(propDesc.onError, ctx) : undefined,
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

    // todo do we really need provide this type property?
    // if (propDesc.type === NodePropType.FunctionalProperty) {
    //   return [
    //     propName,
    //     {
    //       type: NodePropType.FunctionalProperty,
    //       func: instantiateConvertor({
    //         type: 'raw',
    //         args: propDesc.func.args,
    //         body: propDesc.func.body,
    //       }, ctx),
    //     },
    //   ];
    // }

    logger.warn('unsupported property:', propDesc);

    return null;
  }).filter((pair): pair is [string, NodeProperty<Instantiated>] => {
    return !!pair;
  }).reduce<NodeProperties<Instantiated>>((acc, [propName, propDesc]) => {
    acc[propName] = propDesc;
    return acc;
  }, {});
}

function transformNode(node: SchemaNode<Serialized>, ctx: CTX): SchemaNode<Instantiated> {
  const children = (node.children || []).map((n) => transformNode(n, ctx));

  return {
    ...node,
    children,
    props: transformProps(node.props || {}, ctx),
  };
}

type DeserializeSchema = {
  node: SchemaNode<Serialized>;
  ctx: CTX;
}

export default function deserializeSchema({ node, ctx }: DeserializeSchema): SchemaNode<Instantiated> | null {
  try {
    return transformNode(node, ctx);
  } catch (error) {
    logger.error(error);
    return null;
  }
}
