import { List } from 'immutable';
import walk from './walk';

function nodes(node) {
  const nodeKeyPaths = walk(node, (acc, keyPath) => {
    return List.isList(acc) ? acc.push(keyPath) : List.of(keyPath);
  });

  return nodeKeyPaths ? nodeKeyPaths : List.of();
}

export default nodes;
