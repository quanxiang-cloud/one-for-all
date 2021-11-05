import {
  NodeProperty,
  InstantiatedSchema,
  Schema,
  APIState,
  SchemaNode,
  NodeProperties,
  Serialized,
  Instantiated,
  APIStateConvertFuncSpec,
  ParamsBuilderFuncSpec,
  APIInvokeCallbackFuncSpec,
} from './types';

type FunctionSpecs = APIStateConvertFuncSpec | ParamsBuilderFuncSpec | APIInvokeCallbackFuncSpec;

function instantiateFuncSpec({ type, args, body }: FunctionSpecs): ((...args: any[]) => any) | undefined {
  if (type === 'api_state_mapper_func_spec') {
    return new Function('{ data, error, loading, params, ctx }', body) as (apiState: APIState) => any;
  }

  if (type === 'param_builder_func_spec') {
    return new Function(args, body) as (...args: any[]) => any;
  }

  if (type === 'api_invoke_call_func_spec') {
    return new Function('{ data, error, loading, params, ctx }', body) as (...args: any[]) => any;
  }

  return;
}

function transformProps(props: NodeProperties<Serialized>): NodeProperties<Instantiated> {
  return Object.entries(props).map<[string, NodeProperty<Instantiated>] | null>(([propName, propDesc]) => {
    // instantiate Array<APIInvokeProperty<T>>
    if (Array.isArray(propDesc)) {
      return [
        propName,
        propDesc.map(({ type, stateID, paramsBuilder, onSuccess, onError }) => {
          return {
            type,
            stateID,
            paramsBuilder: paramsBuilder ? instantiateFuncSpec(paramsBuilder) : undefined,
            onSuccess: onSuccess ? instantiateFuncSpec(onSuccess) : undefined,
            onError: onError ? instantiateFuncSpec(onError) : undefined,
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
        template: propDesc.template ? instantiateFuncSpec(propDesc.template) : undefined,
      }];
    }

    if (propDesc.type === 'api_invoke_property') {
      return [propName, {
        ...propDesc,
        paramsBuilder: propDesc.paramsBuilder ? instantiateFuncSpec(propDesc.paramsBuilder) : undefined,
        onSuccess: propDesc.onSuccess ? instantiateFuncSpec(propDesc.onSuccess) : undefined,
        onError: propDesc.onError ? instantiateFuncSpec(propDesc.onError) : undefined,
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

function transformNode(node: SchemaNode<Serialized>): SchemaNode<Instantiated> {
  const children = (node.children || []).map((n) => transformNode(n));

  return {
    ...node,
    children,
    props: transformProps(node.props || {}),
  };
}

export default function deserializeSchema({ node, apiStateSpec }: Schema): InstantiatedSchema | null {
  try {
    return { apiStateSpec, node: transformNode(node) };
  } catch (error) {
    console.error(error);
    return null;
  }
}
