import { List } from 'immutable';
import walk from './walk';

/**
 *
 * @param {Immutable} node
 * @returns keyPath list of all nodes
 */
function nodes(node) {
  const nodeKeyPaths = walk(node, (acc, keyPath) => {
    return List.isList(acc) ? acc.push(keyPath) : List.of(keyPath);
  });

  return nodeKeyPaths ? nodeKeyPaths : List.of();
}

export default nodes;
