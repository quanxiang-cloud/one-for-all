import byArbitrary from './byArbitrary';
import previousSibling from './previousSibling';
import hasChildNodes from './hasChildNodes';
import lastChild from './lastChild';
import parent from './parent';

/**
 * @id TreeUtils-left
 * @lookup left
 *
 * #### *method* left()
 *
 * Returns the key path to the next node to the left. The next left node is either:
 * * The last descendant of the previous sibling node.
 * * The previous sibling node.
 * * The parent node.
 * * The none value
 *
 * ```js
 * var nodePath = treeUtils.lastDescendant(state, 'root');
 * while (nodePath) {
 *    console.log(nodePath);
 *    nodePath = treeUtils.left(state, nodePath);
 * }
 * // 'node-6'
 * // 'node-5'
 * // 'node-4'
 * // 'node-3'
 * // 'node-2'
 * // 'node-1'
 * // 'root'
 * ```
 *
 *
 * ###### Signature:
 * ```js
 * left(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>,
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the key path to the node to the right of the one at `idOrKeyPath`.
 */
function left(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);
  let lastChildPath = previousSibling(node, keyPath);

  while (lastChildPath) {
    if (!hasChildNodes(node, lastChildPath)) {
      return lastChildPath;
    }
    lastChildPath = lastChild(node, lastChildPath);
  }

  const parentPath = parent(node, keyPath);

  if (parentPath && parentPath.size) {
    return parentPath;
  }

  return;
}

export default left;
