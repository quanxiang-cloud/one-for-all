import type { APIStatesSpec, NodeProperty, SharedStatesSpec } from '@one-for-all/schema-spec';

import { mapValues, mergeWith, noop } from 'lodash';

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

// map render schema props to react comp props
export function mapRawProps(props: Record<string, NodeProperty>): Record<string, any> {
  return mapValues(props, (v)=> {
    if (v.type === 'constant_property') {
      return v.value;
    }
    // 配置共享状态
    if (v.type === 'shared_state_property') {
      // v.convertor(v.stateID) to get latest state val
      return v.fallback;
    }
    // 配置api状态，发送请求
    // if (v.type === 'api_invoke_property') {
    //   return v;
    // }
    // api返回结果
    if (v.type === 'api_result_property') {
      return v.fallback;
    }
    // 任意自定义函数
    if (v.type === 'functional_property') {
      // fixme: since func prop body may bind render engine ctx, we set it noop
      // return v.func.body;
      return noop;
    }
    // todo: other property
    return v;
  });
}

export function mergeAsRenderEngineProps(prevProps: Record<string, NodeProperty>, newProps: Record<string, any>): Record<string, NodeProperty> {
  return mergeWith(prevProps, newProps, (v: NodeProperty | undefined, newVal: any)=> {
    if (!v) {
      return { type: 'constant_property', value: newVal };
    }

    if (v.type === 'constant_property') {
      return Object.assign({}, v, { value: newVal ?? v.value });
    }
    if (v.type === 'shared_state_property' || v.type === 'api_result_property') {
      return Object.assign({}, v, { fallback: newVal });
    }
    // if (v.type === 'api_invoke_property') {
    //
    // }
    return v;
  });
}

export function transformLifecycleHooks(hooks: any): Record<string, any> {
  return mapValues(hooks, (hook: string)=> {
    if (hook) {
      return {
        type: 'lifecycle_hook_func_spec',
        args: '...args',
        // body: `const fn = ${hook}; return fn(...args)`,
        body: hook,
      };
    }
    return '';
  });
}
