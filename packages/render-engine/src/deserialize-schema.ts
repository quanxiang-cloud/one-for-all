import { noop } from 'rxjs';
import { CTX, LocalStateConvertFuncSpec } from '.';
import {
  NodeProperty,
  APIState,
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
  RawFunctionSpec;

function instantiateFuncSpec({ type, args, body }: FunctionSpecs, ctx: CTX): VersatileFunc {
  if (type === 'api_state_mapper_func_spec') {
    return new Function('{ data, error, loading, params }', body).bind(ctx) as (apiState: APIState) => any;
  }

  if (type === 'param_builder_func_spec') {
    return new Function(args, body).bind(ctx) as (...args: any[]) => any;
  }

  if (type === 'api_invoke_call_func_spec') {
    return new Function('{ data, error, loading, params }', body).bind(ctx) as (...args: any[]) => any;
  }

  if (type === 'raw') {
    // args should be single parameter?
    return new Function(args, body).bind(ctx) as VersatileFunc;
  }

  if (type === 'local_state_convert_func_spec') {
    return new Function('{ data }', body).bind(ctx) as VersatileFunc;
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
