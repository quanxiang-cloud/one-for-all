import { fromJS } from 'immutable';
import _insertAt from './raw/insertAt';

function insertAt(root, parentNodeID, index, node) {
  let _root = fromJS(root);

  _root = _insertAt(_root, parentNodeID, index, node);
  if (!_root) {
    return;
  }

  return _root.toJS();
}

export default insertAt;
