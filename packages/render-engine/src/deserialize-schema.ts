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
): StateConvertorFunc | undefined {
  // todo handle new function error
  const publicCtx = { apiStates: ctx.apiStates, states: ctx.states };

  if (serializedStateConvertor.type === 'state_convert_expression') {
    const fn = new Function('state', `return ${serializedStateConvertor.expression}`).bind(publicCtx);
    fn.toString = () => [
      '',
      'function wrappedStateConvertor(state) {',
      `\treturn ${serializedStateConvertor.expression}`,
      '}',
    ].join('\n');

    return fn;
  }

  if (serializedStateConvertor.type === 'state_convertor_func_spec') {
    const fn = new Function('state', serializedStateConvertor.body).bind(publicCtx);
    fn.toString = () => [
      '',
      'function wrappedStateConvertor(state) {',
      `\t${serializedStateConvertor.body}`,
      '}',
      '',
    ].join('\n');
    return fn;
  }

  return noop;
}

function instantiateFuncSpec(spec: BaseFunctionSpec, ctx: CTX): VersatileFunc | undefined {
  const publicCtx = { apiStates: ctx.apiStates, states: ctx.states };
  try {
    const fn = new Function(spec.args, spec.body).bind(publicCtx);
    fn.toString = () => [
      '',
      `function wrappedFunc(${spec.args}) {`,
      `\t${spec.body}`,
      '}',
      '',
    ].join('\n');
    return fn;
  } catch (error) {
    logger.error(
      'failed to instantiate function of following spec:',
      '\n',
      'spec.args:',
      spec.args,
      '\n',
      'spec.body:',
      '\n',
      spec.body,
      '\n',
      error,
    );
  }
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
