import { fromPairs, map, toPairs, flow } from 'lodash/fp';
import {
  NodeProp,
  EvaluatedSchema,
  ISRawSchema,
  RawSchema,
  FunctionSpecs,
  APIState,
  NodeProps,
  SchemaNode,
} from './types';

function specToFunction({ type, args, body }: FunctionSpecs): ((...args: any[]) => any) | undefined {
  if (type === 'api_derive_function') {
    return new Function('apiState', body) as (apiState: APIState) => any;
  }

  if (type === 'api_invoke_convertor_function') {
    return new Function(args, body) as (...args: any[]) => any;
  }

  if (type === 'api_invoke_call_function') {
    return new Function('apiState', body) as (...args: any[]) => any;
  }

  return;
}

const evalNodeProps: (props: NodeProps<ISRawSchema.YES>) => NodeProps<ISRawSchema.NO> = flow(
  toPairs,
  map(([propName, propDesc]: [string, NodeProp<ISRawSchema.YES>]) => {
    if (Array.isArray(propDesc)) {
      return [propName, propDesc];
    }

    if (propDesc.type === 'constant_property') {
      return [propName, propDesc];
    }

    return [propName, {
      ...propDesc,
      convertor: propDesc.convertor ? specToFunction(propDesc.convertor) : undefined,
    }];
  }),
  fromPairs,
);

function transformNode(node: SchemaNode<ISRawSchema.YES>): SchemaNode<ISRawSchema.NO> {
  const children = (node.children || []).map((n) => transformNode(n));

  return {
    ...node,
    children,
    props: evalNodeProps(node.props || {}),
  };
}

export default function evalRAWSchema({ node, statesMap }: RawSchema): EvaluatedSchema | null {
  try {
    return { statesMap, node: transformNode(node) };
  } catch (error) {
    return null;
  }
}
