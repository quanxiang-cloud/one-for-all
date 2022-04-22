import { List } from 'immutable';
import keyPathById from './keyPathById';
import { getChildNodeKey } from './utils';

function insertAt(root, parentNodeID, index, node) {
  const parentKeyPath = keyPathById(root, parentNodeID);
  if (!parentKeyPath) {
    return;
  }

  const parentNode = root.getIn(parentKeyPath);
  const childNodeKey = getChildNodeKey(parentNode);
  const childrenKeyPath = parentKeyPath.concat([childNodeKey]);
  if (childNodeKey === 'node') {
    return root.setIn(root, childrenKeyPath, node);
  }

  const childrenNodes = root.getIn(childrenKeyPath) || List();
  const leftSideNodes = childrenNodes.slice(0, index);
  const rightSideNodes = childrenNodes.slice(index);

  const allChildrenNodes = leftSideNodes.concat([node], rightSideNodes);
  return root.setIn(childrenKeyPath, allChildrenNodes);
}

export default insertAt;
