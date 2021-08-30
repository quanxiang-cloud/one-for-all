import {
  NodeProp,
  InstantiatedSchema,
  Schema,
  APIState,
  SchemaNode,
  NodeProps,
  Serialized,
  Instantiated,
  APIStateMapperFuncSpec,
  ParamsBuilderFuncSpec,
  APIInvokeCallbackFuncSpec,
} from './types';

type FunctionSpecs = APIStateMapperFuncSpec | ParamsBuilderFuncSpec | APIInvokeCallbackFuncSpec;

function instantiateFuncSpec({ type, args, body }: FunctionSpecs): ((...args: any[]) => any) | undefined {
  if (type === 'api_state_mapper_func_spec') {
    return new Function('apiState', body) as (apiState: APIState) => any;
  }

  if (type === 'param_builder_func_spec') {
    return new Function(args, body) as (...args: any[]) => any;
  }

  if (type === 'api_invoke_call_func_spec') {
    return new Function('apiState', body) as (...args: any[]) => any;
  }

  return;
}

function transformProps(props: NodeProps<Serialized>): NodeProps<Instantiated> {
  return Object.entries(props).map<[string, NodeProp<Instantiated>] | null>(([propName, propDesc]) => {
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
        mapper: propDesc.mapper ? instantiateFuncSpec(propDesc.mapper) : undefined,
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
  }).filter((pair): pair is [string, NodeProp<Instantiated>] => {
    return !!pair;
  }).reduce<NodeProps<Instantiated>>((acc, [propName, propDesc]) => {
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

export default function deserializeSchema({ node, statesMap }: Schema): InstantiatedSchema | null {
  try {
    return { statesMap, node: transformNode(node) };
  } catch (error) {
    console.error(error);
    return null;
  }
}
