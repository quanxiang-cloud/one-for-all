import byArbitrary from './byArbitrary';
import { getChildNodeKey } from './utils';

/**
 * @id TreeUtils-lastChild
 * @lookup lastChild
 *
 * #### *method* lastChild()
 *
 * ###### Signature:
 * ```js
 * lastChild(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the last child node of the node at `idOrKeyPath`
 */
function lastChild(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  const childNode = node.getIn(keyPath);
  if (!childNode) {
    return;
  }

  const childNodeKey = getChildNodeKey(childNode);
  if (!childNodeKey) {
    return;
  }

  if (childNodeKey === 'node' && node.hasIn(keyPath.concat([node]))) {
    return node.getIn(keyPath.concat([node]));
  }

  var item = node.getIn(keyPath.concat([childNodeKey]));
  if (item && item.size > 0) {
    return keyPath.concat([childNodeKey]).concat([item.size - 1]);
  }
  return;
}

export default lastChild;
