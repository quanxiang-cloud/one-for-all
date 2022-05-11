import useInstantiateProps from './';
import { CTX, ArteryNode, NodeProperties, NestedProperty } from '../types';

function getProperties(properties: NodeProperties, ctx: CTX): Record<string, unknown> {
  const dummyNode: ArteryNode = {
    type: 'html-element',
    id: 'placeholder-node',
    name: 'whatever',
    props: properties,
  };
  return useInstantiateProps(dummyNode, ctx);
}

export default function useNestedProps(
  node: ArteryNode,
  ctx: CTX,
): Record<string, unknown> {
  if (!node.props) {
    return {};
  }

  return Object.entries(node.props)
    .filter((pair): pair is [string, NestedProperty] => {
      return pair[1].type === 'nested_property';
    })
    .reduce<Record<string, unknown>>((acc, [key, { value }]) => {
      let prop;
      if (Array.isArray(value)) {
        prop = value.map((properties) => getProperties(properties, ctx));
      } else {
        prop = getProperties(value, ctx);
      }
      return {
        ...acc,
        [key]: prop
      };
    }, {});
}
