import { List } from 'immutable';
import parent from './parent';
import byArbitrary from './byArbitrary';
/**
 * @id TreeUtils-ancestors
 * @lookup ancestors
 *
 * #### *method* ancestors()
 *
 * ###### Signature:
 * ```js
 * ancestors(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>,
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * An >Immutable.List of all key paths that point at direct ancestors of the node at `idOrKeyPath`.
 */
function ancestors(node, idOrKeyPath) {
  let keyPath = byArbitrary(node, idOrKeyPath);
  if (!keyPath) {
    return;
  }

  let list = List();

  while (keyPath.size) {
    keyPath = parent(node, keyPath);
    list = list.push(keyPath);
  }

  return list;
}

export default ancestors;
