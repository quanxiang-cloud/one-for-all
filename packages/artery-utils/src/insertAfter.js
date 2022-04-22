import { fromJS } from 'immutable';
import _parent from './raw/parent';
import _keyPathById from './raw/keyPathById';
import _insertAt from './raw/insertAt';

function insertAfter(root, referenceNodeID, node) {
  let _root = fromJS(root);

  const referenceNodeKeyPath = _keyPathById(_root, referenceNodeID);
  if (!referenceNodeKeyPath) {
    return;
  }

  const referenceNodeIndex = referenceNodeKeyPath.last();
  const parentKeyPath = _parent(_root, referenceNodeID);
  const parentNodeID = _root.getIn(parentKeyPath.concat(['id']));

  _root = _insertAt(_root, parentNodeID, referenceNodeIndex + 1, node);

  if (!_root) {
    return;
  }

  return _root.toJS();
}

export default insertAfter;
