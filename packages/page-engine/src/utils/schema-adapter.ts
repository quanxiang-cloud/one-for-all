import {
  APIStatesSpec,
  NodePropType,
  NodeProperty,
  Serialized,
  SharedStatesSpec,
  ConstantProperty,
} from '@ofa/render-engine';

import { mapValues, mergeWith } from 'lodash';

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
export function mapRawProps(props: Record<string, NodeProperty<Serialized>>): Record<string, any> {
  return mapValues(props, (v)=> {
    if (v.type === NodePropType.ConstantProperty) {
      return v.value;
    }
    // 配置共享状态
    if (v.type === NodePropType.SharedStateProperty) {
      // v.convertor(v.stateID) to get latest state val
      return v.fallback;
    }
    // 配置api状态，发送请求
    if (v.type === NodePropType.APIInvokeProperty) {

    }
    // api返回结果
    if (v.type === NodePropType.APIResultProperty) {

    }
    // 任意自定义函数
    if (v.type === NodePropType.FunctionalProperty) {

    }
    return v;
  });
}

export function mergeProps(prevProps: Record<string, NodeProperty<Serialized>>, newProps: Record<string, any>): Record<string, NodeProperty<Serialized>> {
  return mergeWith(prevProps, newProps, (v: NodeProperty<Serialized> | undefined, newVal: any)=> {
    if (!v) {
      return { type: NodePropType.ConstantProperty, value: newVal };
    }

    if (v.type === NodePropType.ConstantProperty) {
      return Object.assign({}, v, { value: newVal ?? v.value });
    }
    if (v.type === NodePropType.SharedStateProperty) {
      return Object.assign({}, v, { fallback: newVal });
    }
    // if (v.type === NodePropType.APIInvokeProperty) {
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
        body: `const fn = ${hook}; return fn(...args)`,
      };
    }
    return '';
  });
}
