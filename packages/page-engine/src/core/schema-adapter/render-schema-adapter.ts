import { APIStatesSpec, NodeType, ReactComponentNode, Schema, SharedStatesSpec, Serialized, NodePropType } from '@ofa/render-engine';
import { omit, mapValues } from 'lodash';
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
    memo[k] = { initial: parsedVal.val };
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

function transformLifecycleHooks(rawHooks: any): any {
  return rawHooks || {};
}

// todo: 暂时不考虑 html-node, 需要考虑 react node, loop container node
function mapNode(node: PageEngine.Node): ReactComponentNode<Serialized> {
  return {
    id: node.id || elemId(node.comp),
    type: NodeType.ReactComponentNode,
    props: transformProps(node),
    // lifecycleHooks: transformLifecycleHooks(node._hooks),
    packageName: 'ofa-ui',
    packageVersion: 'latest',
    exportName: registry.normalizeType(node.comp),
    children: (node.children || []).map(mapNode),
  };
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
