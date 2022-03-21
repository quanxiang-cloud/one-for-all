import { fromJS } from 'immutable';
import keyPathById from './raw/keyPathById';

function findNodeByID(schemaNode, id) {
  const node = fromJS(schemaNode);
  const keyPath = keyPathById(node, id);
  if (!keyPath) {
    return;
  }

  return node.getIn(keyPath).toJS();
}

export default findNodeByID;
