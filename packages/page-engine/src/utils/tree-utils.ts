import { get } from 'lodash';

import type { PageNode } from '../types';

export function findNode(tree: PageNode, node_id?: string): any {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  // fixme: remove this case
  if (!node_id) {
    return tree;
  }
  // if loop node, return wrapper node
  // && get(tree, 'node.id') === node_id
  if (tree.type === 'loop-container') {
    const loopChildren = get(tree, 'node.children');
    if (loopChildren) {
      for (const child of loopChildren) {
        const found = findNode(child as PageNode, node_id);
        if (found) {
          return found;
        }
      }
    }

    if (get(tree, 'node.id') === node_id) {
      return tree;
    }
  }

  if (tree.id === node_id) {
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
    const idx = tree.children.findIndex((c: any)=> {
      if (c.type === 'react-component') {
        return c.id === node_id;
      }
      if (c.type === 'loop-container') {
        return c.id === node_id || c.node.id === node_id;
      }
    });
    if (idx > -1) {
      tree.children.splice(idx, 1);
    } else {
      tree.children.forEach((c: any)=> {
        if (c.children) {
          removeNode(c, node_id);
        }
      });
    }
  }
}

export function findParent(tree: PageNode, node_id: string): PageNode | undefined {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (tree.children?.find((c: any)=> {
    if (c.type === 'react-component') {
      return c.id === node_id;
    }
    if (c.type === 'loop-container') {
      return c.id === node_id || c.node.id === node_id;
    }
  })) {
    return tree;
  }
  if (tree.children) {
    for (const child of tree.children) {
      const found = findParent(child, node_id);
      if (found) {
        return found;
      }
    }
  }
}

export function findParentId(tree: PageNode, node_id: string, parentIds: string[], allTree: PageNode): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (tree.id === node_id) {
    if (tree.pid) {
      parentIds.push(tree.pid);
      findParentId(allTree, tree.pid, parentIds, allTree);
    }
    return;
  }

  if (tree.children) {
    for (const child of tree.children) {
      findParentId(child, node_id, parentIds, allTree);
    }
  }
}
