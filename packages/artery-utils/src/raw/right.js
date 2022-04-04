import firstChild from './firstChild';
import byArbitrary from './byArbitrary';
import nextSibling from './nextSibling';
import parent from './parent';

/**
 * @id TreeUtils-right
 * @lookup right
 *
 * #### *method* right()
 *
 * Returns the key path to the next node to the right. The next right node is either:
 * * The first child node.
 * * The next sibling.
 * * The next sibling of the first ancestor that in fact has a next sibling.
 * * The none value
 *
 * ```js
 * var nodePath = treeUtils.byId(state, 'root');
 * while (nodePath) {
 *    console.log(nodePath);
 *    nodePath = treeUtils.right(state, nodePath);
 * }
 * // 'root'
 * // 'node-1'
 * // 'node-2'
 * // 'node-3'
 * // 'node-4'
 * // 'node-5'
 * // 'node-6'
 * ```
 *
 * ###### Signature:
 * ```js
 * right(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>,
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the key path to the node to the right of the one at `idOrKeyPath`.
 */
function right(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);
  const firstChildPath = firstChild(node, keyPath);

  if (firstChildPath) {
    return firstChildPath;
  }

  const nextSiblingPath = nextSibling(node, keyPath);
  if (nextSiblingPath) {
    return nextSiblingPath;
  }

  let parentPath = parent(node, keyPath);
  let nextSiblingOfParent;

  while (parentPath && parentPath.size >= 0) {
    nextSiblingOfParent = nextSibling(node, parentPath);
    if (nextSiblingOfParent) {
      return nextSiblingOfParent;
    }
    parentPath = parent(node, parentPath);
  }

  return;
}

export default right;
