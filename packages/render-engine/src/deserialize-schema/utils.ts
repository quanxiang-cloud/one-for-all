import type * as SchemaSpec from '@one-for-all/schema-spec';

import {
  CTX,
  VersatileFunc,
  RenderEngineCTX,
  StateConvertor,
} from '../types';

export function isObject(n: unknown): boolean {
  return Object.prototype.toString.call(n) === '[object Object]';
}

export function isFuncSpec(n: unknown): boolean {
  if (!isObject(n) || typeof n !== 'object' || n === null) {
    return false;
  }

  if ('type' in n && Reflect.get(n, 'type') === 'state_convert_expression') {
    return true;
  }

  if (Object.keys(n).length === 3 && 'type' in n && 'args' in n && 'body' in n) {
    return true;
  }

  return false;
}

function instantiateStateExpression(
  expression: string,
  renderEngineCTX: RenderEngineCTX,
): StateConvertor {
  try {
    const fn = new Function('state', `return ${expression}`).bind(renderEngineCTX);
    fn.toString = () => [
      '',
      'function wrappedStateConvertor(state) {',
      `\treturn ${expression}`,
      '}',
    ].join('\n');

    return fn;
  } catch (error) {
    throw new Error(
      [
        'failed to instantiate state convert expression:',
        '\n',
        expression,
        '\n',
        error,
      ].join(''),
    );
  }
}

export function instantiateFuncSpec(
  spec: SchemaSpec.BaseFunctionSpec | SchemaSpec.StateConvertExpression,
  ctx: CTX,
): VersatileFunc {
  const renderEngineCTX: RenderEngineCTX = { apiStates: ctx.apiStates, states: ctx.states };

  if ('expression' in spec && spec.type === 'state_convert_expression') {
    return instantiateStateExpression(spec.expression, renderEngineCTX);
  }

  try {
    const fn = new Function(spec.args, spec.body).bind(renderEngineCTX);
    fn.toString = () => [
      '',
      `function wrappedFunc(${spec.args}) {`,
      `\t${spec.body}`,
      '}',
      '',
    ].join('\n');
    return fn;
  } catch (error) {
    throw new Error(
      [
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
      ].join(''),
    );
  }
}
