import {
  APIStatesSpec,
  NodePropType,
  SharedStatesSpec,
  ConstantProperty,
} from '@ofa/render-engine';

import { mapValues, omit, pick } from 'lodash';

export function mapApiState(states: Record<string, string>): APIStatesSpec {
  return Object.entries(states).reduce((memo: Record<string, any>, [k, v]: [string, string])=> {
    memo[k] = { apiID: v };
    return memo;
  }, {});
}

export function mapShareState(states: Record<string, string>): SharedStatesSpec {
  return Object.entries(states).reduce((memo: Record<string, any>, [k, v]: [string, string])=> {
    const parsedVal: {val: any} = JSON.parse(v);
    memo[k] = { initial: JSON.parse(parsedVal.val) };
    return memo;
  }, {});
}

export function transformConstantProps(props: any): Record<string, ConstantProperty> {
  return mapValues(props, (value: any)=> ({ type: NodePropType.ConstantProperty, value }));
}

export function transformLifecycleHooks(hooks: any): Record<string, any> {
  return mapValues(hooks, (hook: string)=> {
    if (hook) {
      return {
        type: 'lifecycle_hook_func_spec',
        args: '...args',
        body: `const fn = ${hook}; return fn(...args)`,
      };
    }
    return '';
  });
}
