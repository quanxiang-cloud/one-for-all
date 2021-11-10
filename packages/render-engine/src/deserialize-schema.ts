import { noop } from 'rxjs';
import { APIStateTemplate, CTX, LocalStateConvertFuncSpec } from '.';
import {
  NodeProperty,
  SchemaNode,
  NodeProperties,
  Serialized,
  Instantiated,
  APIStateConvertFuncSpec,
  ParamsBuilderFuncSpec,
  APIInvokeCallbackFuncSpec,
  ComponentPropType,
  RawFunctionSpec,
  VersatileFunc,
} from './types';

type FunctionSpecs =
  APIStateConvertFuncSpec |
  ParamsBuilderFuncSpec |
  APIInvokeCallbackFuncSpec |
  LocalStateConvertFuncSpec |
  RawFunctionSpec |
  APIStateTemplate;

// todo move this to constant, and should be defined as a type
const API_STATE_FUNC_ARGS = '{ data, error, loading, params }';

function instantiateFuncSpec(spec: FunctionSpecs, ctx: CTX): VersatileFunc {
  if (spec.type === 'api_state_template') {
    return new Function(
      API_STATE_FUNC_ARGS,
      `return ${spec.template}`,
    ).bind(ctx);
  }

  if (spec.type === 'api_state_mapper_func_spec') {
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

  if (spec.type === 'local_state_convert_func_spec') {
    return new Function('{ data }', spec.body).bind(ctx);
  }

  return noop;
}

function transformProps(props: NodeProperties<Serialized>, ctx: CTX): NodeProperties<Instantiated> {
  return Object.entries(props).map<[string, NodeProperty<Instantiated>] | null>(([propName, propDesc]) => {
    // instantiate Array<APIInvokeProperty<T>>
    if (Array.isArray(propDesc)) {
      return [
        propName,
        propDesc.map(({ type, stateID, paramsBuilder, onSuccess, onError }) => {
          return {
            type,
            stateID,
            paramsBuilder: paramsBuilder ? instantiateFuncSpec(paramsBuilder, ctx) : undefined,
            onSuccess: onSuccess ? instantiateFuncSpec(onSuccess, ctx) : undefined,
            onError: onError ? instantiateFuncSpec(onError, ctx) : undefined,
          };
        }),
      ];
    }

    if (propDesc.type === 'constant_property') {
      return [propName, propDesc];
    }

    if (propDesc.type === 'api_derived_property') {
      return [propName, {
        ...propDesc,
        adapter: propDesc.adapter ? instantiateFuncSpec(propDesc.adapter, ctx) : undefined,
      }];
    }

    if (propDesc.type === ComponentPropType.LocalStateProperty) {
      return [
        propName,
        {
          ...propDesc,
          adapter: propDesc.adapter ? instantiateFuncSpec(propDesc.adapter, ctx) : undefined,
        },
      ];
    }

    if (propDesc.type === ComponentPropType.FunctionalProperty) {
      return [
        propName,
        {
          type: ComponentPropType.FunctionalProperty,
          func: instantiateFuncSpec({
            type: 'raw',
            args: propDesc.func.args,
            body: propDesc.func.body,
          }, ctx),
        },
      ];
    }

    if (propDesc.type === 'api_invoke_property') {
      return [propName, {
        ...propDesc,
        paramsBuilder: propDesc.paramsBuilder ? instantiateFuncSpec(propDesc.paramsBuilder, ctx) : undefined,
        onSuccess: propDesc.onSuccess ? instantiateFuncSpec(propDesc.onSuccess, ctx) : undefined,
        onError: propDesc.onError ? instantiateFuncSpec(propDesc.onError, ctx) : undefined,
      }];
    }

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
    console.error(error);
    return null;
  }
}
