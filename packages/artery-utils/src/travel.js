import { Map } from 'immutable';
import { isImmutable } from 'immutable';
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
  const _newRoot = walk(node, (newRoot, keyPath) => {
    if (!newRoot) {
      newRoot = node;
    }

    const nodeType = node.getIn(keyPath.concat(['type']));
    const currentNode = node.getIn(keyPath).toJS();
    const newNode = Visitors[NODE_TYPE_TRAVELER_MAP[nodeType]]?.(currentNode);
    if (newNode !== undefined) {
      newRoot = newRoot.setIn(keyPath, newNode);
      if (!isImmutable(newRoot)) {
        newRoot = Map(newRoot);
      }
    }

    return newRoot;
  });

  return _newRoot.toJS();
}
