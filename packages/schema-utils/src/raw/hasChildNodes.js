import byArbitrary from './byArbitrary';
import { getChildNodeKey, exists } from './utils';
/**
 * @id TreeUtils-hasChildNodes
 * @lookup hasChildNodes
 *
 * #### *method* hasChildNodes()
 *
 * ###### Signature:
 * ```js
 * hasChildNodes(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>,
 * ): boolean
 * ```
 *
 * ###### Returns:
 * Returns whether the node at `idOrKeyPath` has children.
 */
function hasChildNodes(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  if (!node.hasIn(keyPath)) {
    return false;
  }

  const childKey = getChildNodeKey(node.getIn(keyPath));
  if (!childKey) {
    return false;
  }

  const childrenNodes = node.getIn(keyPath.concat([childKey]));

  return exists(childrenNodes) && childrenNodes.size > 0;
}

export default hasChildNodes;
