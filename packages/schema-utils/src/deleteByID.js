import { fromJS, removeIn } from 'immutable';
import keyPathById from './raw/keyPathById';

function deleteByID(schemaNode, id) {
  const node = fromJS(schemaNode);
  const keyPath = keyPathById(node, id);
  if (!keyPath) {
    return schemaNode;
  }

  return removeIn(node, keyPath).toJS();
}

export default deleteByID;
