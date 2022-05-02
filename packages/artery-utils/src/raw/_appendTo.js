import { List } from 'immutable';
import byArbitrary from './byArbitrary';
import { getChildNodeKey } from './utils';

function _appendTo(root, parentIdOrKeyPath, node) {
  const parentKeyPath = byArbitrary(root, parentIdOrKeyPath);
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
  return root.setIn(childrenKeyPath, childrenNodes.push(node));
}

export default _appendTo;
