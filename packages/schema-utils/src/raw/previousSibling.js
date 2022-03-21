import byArbitrary from './byArbitrary';
/**
 * @id TreeUtils-previousSibling
 * @lookup previousSibling
 *
 * #### *method* previousSibling()
 *
 * ###### Signature:
 * ```js
 * previousSibling(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the previous sibling node of the node at `idOrKeyPath`
 */
function previousSibling(state, idOrKeyPath) {
  const keyPath = byArbitrary(state, idOrKeyPath);
  const index = Number(keyPath.last());
  if (isNaN(index) || index === 0) {
    return;
  }

  return keyPath.skipLast(1).concat([index - 1]);
}
export default previousSibling;
