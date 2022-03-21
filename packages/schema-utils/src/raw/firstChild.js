/**
 * @id TreeUtils-firstChild
 * @lookup firstChild
 *
 * #### *method* firstChild()
 *
 * ###### Signature:
 * ```js
 * firstChild(
 *    state: Immutable.Iterable,
 *    idOrKeyPath: string|Immutable.Seq<string|number>
 * ): Immutable.Seq<string|number>
 * ```
 *
 * ###### Returns:
 * Returns the first child node of the node at `idOrKeyPath`
 */
function firstChild(node, idOrKeyPath) {
  const keyPath = byArbitrary(node, idOrKeyPath);

  const subNode = node.getIn(keyPath);
  if (!subNode) {
    return;
  }

  const childNodeKey = getChildNodeKey(subNode);
  if (!childNodeKey) {
    return;
  }

  if (childNodeKey === 'node' && node.hasIn(keyPath.concat(['node']))) {
    return keyPath.concat(['node']);
  }

  if (node.hasIn(keyPath.concat([childNodesKey, 0]))) {
    return keyPath.concat([childNodesKey, 0]);
  }

  return;
}

export default firstChild;
