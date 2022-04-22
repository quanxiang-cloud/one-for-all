import { fromJS } from 'immutable';
import parent from './raw/parent';
import _insertAt from './raw/insertAt';
import _keyPathById from './raw/keyPathById';

function insertBefore(root, referenceNodeID, node) {
  let _root = fromJS(root);

  const referenceNodeKeyPath = _keyPathById(_root, referenceNodeID);
  if (!referenceNodeKeyPath) {
    return;
  }

  const referenceNodeIndex = referenceNodeKeyPath.last();
  const parentKeyPath = parent(_root, referenceNodeID);
  const parentNodeID = _root.getIn(parentKeyPath.concat(['id']));
  _root = _insertAt(_root, parentNodeID, referenceNodeIndex, node);

  if (!_root) {
    return;
  }

  return _root.toJS();
}

export default insertBefore;
