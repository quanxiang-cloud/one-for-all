import { fromJS } from 'immutable';
import walk from './raw/walk';

const NODE_TYPE_TRAVELER_MAP = {
  'html-element': 'htmlElement',
  'react-component': 'reactComponent',
  'loop-container': 'loopContainer',
  'composed-node': 'composedNode',
  'ref-node': 'refNode',
  'jsx-node': 'jsxNode',
  'route-node': 'routeNode',
}

export default function travel(schemaNode, travelers) {
  const node = fromJS(schemaNode);
  walk(node, (_, keyPath) => {
    const nodeType = node.getIn(keyPath.concat(['type']));
    const currentNode = node.getIn(keyPath).toJS();
    travelers[NODE_TYPE_TRAVELER_MAP[nodeType]]?.(currentNode);
  });
}
