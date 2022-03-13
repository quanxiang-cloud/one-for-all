/**
 *
 * @param {ImmutableNode} node
 * @param {Seq.Indexed<string>} keyPath
 * @returns node id or undefined
 */
function id(node, keyPath) {
  if (!node.getIn(keyPath)) {
    return;
  }

  return node.getIn(keyPath.concat(['id']));
}

export default id;
