import byArbitrary from './byArbitrary';

/**
 * @id TreeUtils-nextSibling
 * @lookup nextSibling
 *
 * #### *method* nextSibling()
 *
 * ###### Signature:
 * ```js
 * nextSibling(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the next sibling node of the node at `idOrKeyPath`
 */
function nextSibling(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);
  const index = Number(keyPath.last());
  if (isNaN(index)) {
    return;
  }

  const nextSiblingPath = keyPath.skipLast(1).concat(index + 1);
  if (node.hasIn(nextSiblingPath)) {
    return nextSiblingPath;
  }
  return;
}

export default nextSibling;
