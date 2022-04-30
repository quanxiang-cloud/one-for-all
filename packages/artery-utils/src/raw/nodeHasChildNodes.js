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
function nodeHasChildNodes(node) {
  const childKey = getChildNodeKey(node);
  if (!childKey) {
    return false;
  }

  const childrenNodes = node.getIn([childKey]);

  return exists(childrenNodes) && childrenNodes.size > 0;
}

export default nodeHasChildNodes;
