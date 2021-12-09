export function findNode(tree: PageEngine.Node, node_id?: string): any {
  if (!tree || typeof tree !== 'object') {
    return false;
  }

  if (tree.id === node_id || !node_id) {
    return tree;
  }
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child as PageEngine.Node, node_id);
      if (found) {
        return found;
      }
    }
  }
}
