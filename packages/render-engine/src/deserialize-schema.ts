import { noop } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  NodeProperty,
  SchemaNode,
  NodeProperties,
  Serialized,
  Instantiated,
  APIResultAdapterFuncSpec,
  ParamsBuilderFuncSpec,
  APIInvokeCallbackFuncSpec,
  NodePropType,
  RawFunctionSpec,
  Adapter,
  APIResultTemplate,
  CTX,
  RawDataConvertorSpec,
  ExpressionStatement,
} from './types';

// todo refactor this type
type FunctionSpecs =
  APIResultAdapterFuncSpec |
  ParamsBuilderFuncSpec |
  APIInvokeCallbackFuncSpec |
  RawDataConvertorSpec |
  RawFunctionSpec |
  APIResultTemplate |
  ExpressionStatement;

// todo move this to constant, and should be defined as a type
const API_STATE_FUNC_ARGS = 'result';
const LOCAL_STATE_FUNC_ARGS = 'data';

function instantiateFuncSpec(spec: FunctionSpecs, ctx: CTX): Adapter {
  if (spec.type === 'api_result_template') {
    return new Function(
      API_STATE_FUNC_ARGS,
      `return ${spec.template}`,
    ).bind(ctx);
  }

  if (spec.type === 'api_result_convertor_func_spec') {
    return new Function(API_STATE_FUNC_ARGS, spec.body).bind(ctx);
  }

  if (spec.type === 'param_builder_func_spec') {
    return new Function(spec.args, spec.body).bind(ctx);
  }

  if (spec.type === 'api_invoke_call_func_spec') {
    return new Function(API_STATE_FUNC_ARGS, spec.body).bind(ctx);
  }

  if (spec.type === 'raw') {
    // args should be single parameter?
    return new Function(spec.args, spec.body).bind(ctx);
  }

  if (spec.type === 'raw_data_convert_func_spec') {
    return new Function(LOCAL_STATE_FUNC_ARGS, spec.body).bind(ctx);
  }

  if (spec.type === 'expression_statement') {
    return new Function(LOCAL_STATE_FUNC_ARGS, `return ${spec.expression}`).bind(ctx);
  }

  return noop;
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

    if (propDesc.type === NodePropType.ConstantProperty) {
      return [propName, propDesc];
    }

    if (propDesc.type === 'api_result_property') {
      return [propName, {
        ...propDesc,
        adapter: propDesc.adapter ? instantiateFuncSpec(propDesc.adapter, ctx) : undefined,
      }];
    }

    if (propDesc.type === NodePropType.SharedStateProperty) {
      return [
        propName,
        {
          ...propDesc,
          adapter: propDesc.adapter ? instantiateFuncSpec(propDesc.adapter, ctx) : undefined,
        },
      ];
    }

    if (propDesc.type === NodePropType.FunctionalProperty) {
      return [
        propName,
        {
          type: NodePropType.FunctionalProperty,
          func: instantiateFuncSpec({
            type: 'raw',
            args: propDesc.func.args,
            body: propDesc.func.body,
          }, ctx),
        },
      ];
    }

    if (propDesc.type === NodePropType.NodeStateProperty) {
      return [
        propName,
        {
          ...propDesc,
          type: propDesc.type,
          nodeKey: propDesc.nodeKey,
          fallback: propDesc.fallback,
          adapter: instantiateFuncSpec(propDesc.adapter || { type: 'raw', args: 'v', body: 'return v' }, ctx),
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
          adapter: instantiateFuncSpec(propDesc.adapter || { type: 'raw', args: 'v', body: 'return v' }, ctx),
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
