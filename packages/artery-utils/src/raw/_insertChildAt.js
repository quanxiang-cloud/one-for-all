import { byArbitrary } from '@one-for-all/artery-utils';
import { List } from 'immutable';
import { getChildNodeKey } from './utils';

function _insertChildAt(root, parentIdOrKeyPath, index, node) {
  const _parentIdOrKeyPath = byArbitrary(root, parentIdOrKeyPath);
  if (!_parentIdOrKeyPath) {
    return;
  }

  const parentNode = root.getIn(_parentIdOrKeyPath);
  const childNodeKey = getChildNodeKey(parentNode);
  const childrenKeyPath = _parentIdOrKeyPath.concat([childNodeKey]);
  if (childNodeKey === 'node') {
    return root.setIn(root, childrenKeyPath, node);
  }

  const childrenNodes = root.getIn(childrenKeyPath) || List();
  const leftSideNodes = childrenNodes.slice(0, index);
  const rightSideNodes = childrenNodes.slice(index);

  const allChildrenNodes = leftSideNodes.concat([node], rightSideNodes);
  return root.setIn(childrenKeyPath, allChildrenNodes);
}

export default _insertChildAt;
