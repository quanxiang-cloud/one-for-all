import { noop } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  BaseFunctionSpec,
  StateConvertorFunc,
  CTX,
  SerializedStateConvertor,
  VersatileFunc,
  Instantiated,
  LifecycleHooks,
  Serialized,
} from '../types';

export function instantiateConvertor(
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

export function instantiateLifecycleHook(
  { didMount, willUnmount }: LifecycleHooks<Serialized>,
  ctx: CTX,
): LifecycleHooks<Instantiated> {
  return {
    didMount: didMount ? instantiateFuncSpec(didMount, ctx) : undefined,
    willUnmount: willUnmount ? instantiateFuncSpec(willUnmount, ctx) : undefined,
  };
}

export function instantiateFuncSpec<T = unknown>(
  spec: BaseFunctionSpec,
  ctx: CTX,
): VersatileFunc<T> | undefined {
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
