import { fromJS } from 'immutable';
import keyPathById from './raw/keyPathById';
import hasChildNodes from './raw/hasChildNodes';
import { setIn } from 'immutable';
import { getChildNodeKey } from './raw/utils';
import { Iterable } from 'immutable';

function appendChild(schemaNode, parentID, child) {
  let node = fromJS(schemaNode);
  const keyPath = keyPathById(node, parentID);
  if (!keyPath) {
    return;
  }

  const parentNode = node.getIn(keyPath);
  if (!parentNode) {
    return;
  }

  const childNodeKey = getChildNodeKey(parentNode);
  if (!childNodeKey) {
    return;
  }

  if (childNodeKey === 'node') {
    return setIn(node, keyPath.concat([childNodeKey]), child).toJS();
  }

  const childrenKeyPath = keyPath.concat([childNodeKey]);
  if (!hasChildNodes(node, keyPath)) {
    node = setIn(node, childrenKeyPath, []);
  }

  const item = node.getIn(childrenKeyPath);
  const size = Iterable.isIterable(item) ? item.size : item.length;
  return node.setIn(childrenKeyPath.concat([size]), child).toJS();
}

export default appendChild;
