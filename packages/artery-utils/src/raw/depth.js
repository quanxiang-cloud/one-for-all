import byArbitrary from './byArbitrary';

/**
 * @id TreeUtils-depth
 * @lookup depth
 *
 * #### *method* depth()
 *
 * ###### Signature:
 * ```js
 * depth(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>,
 * ): number
 * ```
 *
 * ###### Returns:
 * A numeric representation of the depth of the node at `idOrKeyPath`
 */
function depth(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  if (!keyPath) {
    return;
  }

  // call filter will not preserve the seq size
  // https://immutable-js.com/docs/v3.8.2/Seq/#size
  return Math.floor(keyPath.filter((v) => typeof v !== 'number').toJS().length);
}

export default depth;
