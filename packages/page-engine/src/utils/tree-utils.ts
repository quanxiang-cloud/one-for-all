import type { PageNode } from '@ofa/page-engine';

// type TreeNode=PageNode | undefined;

export function findNode(tree: PageNode, node_id?: string): any {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (tree.id === node_id || !node_id) {
    return tree;
  }
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child as PageNode, node_id);
      if (found) {
        return found;
      }
    }
  }
}

export function removeNode(tree: PageNode, node_id: string): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }
  if (tree.children) {
    const idx = tree.children.findIndex((c)=> c.id === node_id);
    if (idx > -1) {
      tree.children.splice(idx, 1);
    } else {
      tree.children.forEach((c)=> {
        if (c.children) {
          removeNode(c, node_id);
        }
      });
    }
  }
}
