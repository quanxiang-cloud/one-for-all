import {
  APIStatesSpec,
  NodePropType,
  NodeType,
  Schema,
  SchemaNode,
  Serialized,
  SharedStatesSpec,
} from '@ofa/render-engine';
import { get, set, mapValues, omit, cloneDeep } from 'lodash';
import { elemId } from '../../utils';
import registry from '../../stores/registry';

function mapApiState(states: Record<string, string>): APIStatesSpec {
  return Object.entries(states).reduce((memo: Record<string, any>, [k, v]: [string, string])=> {
    memo[k] = { apiID: v };
    return memo;
  }, {});
}

function mapShareState(states: Record<string, string>): SharedStatesSpec {
  return Object.entries(states).reduce((memo: Record<string, any>, [k, v]: [string, string])=> {
    const parsedVal: {val: any} = JSON.parse(v);
    memo[k] = { initial: JSON.parse(parsedVal.val) };
    return memo;
  }, {});
}

function transformProps(node: PageEngine.Node): any {
  const props = mapValues(node.props, (value: any)=> ({ type: NodePropType.ConstantProperty, value }));
  if (node._style) {
    Object.assign(props, { style: { type: NodePropType.ConstantProperty, value: node._style } });
  }
  return props;
}

function transformLifecycleHooks(node: PageEngine.Node): Record<string, any> {
  return mapValues(node._hooks, (rawHook: string)=> {
    return {
      type: 'lifecycle_hook_func_spec',
      args: '...args',
      body: `const fn = ${rawHook}; return fn(...args)`,
    };
  });
}

// todo: 暂时不考虑 html-node, 需要考虑 react node, loop container node
function mapNode(node: PageEngine.Node): SchemaNode<Serialized> {
  const loopConf = get(node, '_renderer.for', '');

  if (loopConf) {
    // loop container node
    let iterType = 'constant_property';
    if (loopConf.includes('sharedState')) {
      iterType = 'shared_state_property';
    } else if (loopConf.incldes('apiState')) {
      iterType = 'api_result_property';
    }
    const cloneNode = cloneDeep(node);
    set(cloneNode, '_renderer.for', '');

    // get state id
    const reg = new RegExp(`${iterType === 'shared_state_property' ? 'sharedState' : 'apiState'}\\['(.+)'\\]`);
    const matchStateId = loopConf.match(reg);

    return {
      id: elemId('loop-container'),
      loopKey: 'id', // todo: collect from page
      toProps: {
        type: 'to_props_function_spec',
        args: 'state',
        body: 'return state', // todo: collect toProps body from page
      },
      type: NodeType.LoopContainerNode,
      iterableState: {
        type: iterType as any,
        stateID: matchStateId && matchStateId[1] ? matchStateId[1] : '',
        convertor: {
          // todo
          expression: 'state.data',
          type: 'state_convert_expression',
        },
        fallback: [],
      },
      node: mapNode(cloneNode),
    };
  } else {
    // normal react node
    return {
      id: node.id || elemId(node.comp),
      type: NodeType.ReactComponentNode,
      props: transformProps(node),
      lifecycleHooks: transformLifecycleHooks(node),
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      exportName: registry.normalizeType(node.comp),
      children: (node.children || []).map(mapNode),
    };
  }
}

export default function toRenderSchema(schema: PageEngine.Node): Schema {
  const apiStateSpec = mapApiState(schema._api || {});
  const sharedStatesSpec = mapShareState(schema._shared || {});

  return {
    apiStateSpec,
    sharedStatesSpec,
    node: mapNode(omit(schema, ['_api', '_shared'])),
  };
}
