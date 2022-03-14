import { fromJS } from 'immutable';
import walk from './raw/walk';

const NODE_TYPE_TRAVELER_MAP = {
  'html-element': 'htmlNode',
  'react-component': 'reactComponentNode',
  'loop-container': 'loopContainerNode',
  'composed-node': 'composedNode',
  'ref-node': 'refNode',
  'jsx-node': 'jsxNode',
  'route-node': 'routeNode',
};

export default function travel(schemaNode, Visitors) {
  const node = fromJS(schemaNode);
  walk(node, (_, keyPath) => {
    const nodeType = node.getIn(keyPath.concat(['type']));
    const currentNode = node.getIn(keyPath).toJS();
    Visitors[NODE_TYPE_TRAVELER_MAP[nodeType]]?.(currentNode);
  });
}
