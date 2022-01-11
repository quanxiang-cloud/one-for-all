import { get, omit } from 'lodash';
import { toJS } from 'mobx';

import type { PageNode } from '@ofa/page-engine';
import { NodeType } from '@ofa/render-engine';

export function findNode(tree: PageNode, node_id?: string): any {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  // fixme: remove this case
  if (!node_id) {
    return tree;
  }
  // if loop node, return wrapper node
  if (tree.type === NodeType.LoopContainerNode && get(tree, 'node.id') === node_id) {
    const loopChildren = tree.node.children || [];
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
      if (c.type === NodeType.ReactComponentNode) {
        return c.id === node_id;
      }
      if (c.type === NodeType.LoopContainerNode) {
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
    if (c.type === NodeType.ReactComponentNode) {
      return c.id === node_id;
    }
    if (c.type === NodeType.LoopContainerNode) {
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
