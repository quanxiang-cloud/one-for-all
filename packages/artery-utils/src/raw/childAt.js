import byArbitrary from './byArbitrary';
import { getChildNodeKey } from './utils';

function childAt(node, idOrKeyPath, index) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  if (!node.getIn(keyPath)) {
    return;
  }

  const childNodeKey = getChildNodeKey(node.getIn(keyPath));
  if (!childNodeKey) {
    return;
  }

  const _keyPath = keyPath.concat([childNodeKey, index]);
  if (node.hasIn(_keyPath)) {
    return _keyPath;
  }
}

export default childAt;
