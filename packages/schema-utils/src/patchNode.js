import { fromJS, merge } from 'immutable';
import keyPathById from './raw/keyPathById';

function patchNode(schemaNode, partialNode) {
  const node = fromJS(schemaNode);
  const keyPath = keyPathById(node, partialNode.id);
  if (!keyPath) {
    return;
  }

  const nodeToPatch = node.getIn(keyPath);
  if (!nodeToPatch) {
    return;
  }

  return node.setIn(keyPath, merge(nodeToPatch, partialNode)).toJS();
}

export default patchNode;
