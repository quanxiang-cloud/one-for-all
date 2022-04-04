export function exists(value) {
  return value !== null && typeof value !== 'undefined';
}

export function getChildNodeKey(node) {
  const nodeType = node.getIn(['type']);
  if (nodeType === 'jsx-node' || nodeType === 'ref-node') {
    return;
  }

  if (nodeType === 'composed-node') {
    return 'nodes';
  }

  if (nodeType === 'loop-container' || nodeType === 'route-node') {
    return 'node';
  }

  return 'children';
}
