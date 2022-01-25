import { get } from 'lodash';
import { toJS } from 'mobx';

import type { PageNode } from '@ofa/page-engine';

export function findNode(tree: PageNode, node_id?: string, loopNode?: boolean): any {
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
    // const loopChildren = get(tree, 'node.children');
    // if (loopChildren) {
    //   for (const child of loopChildren) {
    //     const found = findNode(child as PageNode, node_id);
    //     if (found) {
    //       return found;
    //     }
    //   }
    // }

    if (loopNode) {
      if (tree.node?.type === 'composed-node') {
        const { outLayer, children } = tree.node;
        if (outLayer && outLayer.id === node_id) {
          return tree;
        }

        if (children) {
          const isHave = children.find((item) => item.id === node_id);
          if (isHave) {
            return tree;
          }
        }
      }

      if (get(tree, 'node.id') === node_id) {
        return tree;
      }
    }

    if (tree.node) {
      // support composed-node
      if (tree.node.type === 'composed-node') {
        const { outLayer, children } = tree.node;
        if (outLayer && outLayer.id === node_id) {
          return outLayer;
        }

        if (children) {
          const isHave = children.find((item) => item.id === node_id);
          if (isHave) {
            return isHave;
          }
        }
      }
    }

    if (get(tree, 'node.id') === node_id) {
      return tree.node;
    }
  }

  if (tree.id === node_id) {
    return tree;
  }

  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child as PageNode, node_id, loopNode);
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
        // support composed-node
        if (c.node && c.node.type === 'composed-node') {
          const { outLayer, children } = c.node;
          if (outLayer && outLayer.id === node_id) {
            return outLayer.id === node_id;
          }
          if (children) {
            removeNode(c.node, node_id);
          }
        }
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

export function copyNode(tree: PageNode, node_id: string, newNode: PageNode): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }
  let newIndex = 0;
  let outAdd = false;
  if (tree.children) {
    tree.children.map((child, index) => {
      if (child.id === node_id) {
        newIndex = index;
        outAdd = true;
        return;
      }

      if (child.type === 'loop-container') {
        const { node } = child;
        if (node) {
          if (node.id === node_id) {
            outAdd = true;
            newIndex = index;
            return;
          }

          if (node.type === 'composed-node') {
            const { children, outLayer } = node;
            if (outLayer && outLayer.id === node_id) {
              outAdd = true;
              newIndex = index;
              return;
            }
            let inAdd = false;
            (children || []).map((item, _index) => {
              if (item.id === node_id) {
                inAdd = true;
                newIndex = _index;
                return;
              }
              return item;
            });

            inAdd && children?.splice(newIndex, 0, newNode);
            return;
          }
        }
        return;
      }

      if (child.children) {
        copyNode(child, node_id, newNode);
        return;
      }
    });

    outAdd && tree.children.splice(newIndex, 0, newNode);
  }
}

export function replaceNode(tree: PageNode, node_id: string, newNode: PageNode): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }
  let newIndex = 0;
  let outAdd = false;
  if (tree.children) {
    tree.children.map((child, index) => {
      if (child.id === node_id) {
        newIndex = index;
        outAdd = true;
        return;
      }

      if (child.type === 'loop-container') {
        const { node } = child;
        if (node) {
          if (node.id === node_id) {
            outAdd = true;
            newIndex = index;
            return;
          }

          if (node.type === 'composed-node') {
            const { children, outLayer } = node;
            if (outLayer && outLayer.id === node_id) {
              outAdd = true;
              newIndex = index;
              return;
            }
            let inAdd = false;
            (children || []).map((item, _index) => {
              if (item.id === node_id) {
                inAdd = true;
                newIndex = _index;
                return;
              }
              return item;
            });

            inAdd && children?.splice(newIndex, 1, newNode);
            return;
          }
        }
        return;
      }

      if (child.children) {
        replaceNode(child, node_id, newNode);
        return;
      }
    });

    outAdd && tree.children.splice(newIndex, 1, newNode);
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
      // support composed-node
      if (c.node && c.node.type === 'composed-node') {
        const { outLayer, children } = c.node;
        if (outLayer && outLayer.id === node_id) {
          return outLayer.id === node_id;
        }
        if (children) {
          console.log('走了');
          return findParent(c.node, node_id);
        }
      }

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

export function findParentXx(tree: PageNode, node_id: string, allTree: PageNode): [PageNode | undefined, PageNode[]] {
  let _parentNode = undefined;
  let _childrenNodes: PageNode[] = [];
  if (!tree || typeof tree !== 'object') {
    return [_parentNode, []];
  }

  if (tree.id === node_id) {
    _parentNode = tree;
    return [_parentNode, []];
  }

  if (tree.children) {
    tree.children.map((item) => {
      if (item.id === node_id) {
        _parentNode = tree;
        return;
      }

      if (item.type === 'loop-container') {
        const { node } = item;
        if (node) {
          // support composed-node
          if (node.type === 'composed-node') {
            const { outLayer, children = [] } = node;
            if (outLayer && outLayer.id === node_id) {
              return outLayer.pid && findParentXx(allTree, outLayer.pid, allTree);
            }
            children.map((child) => {
              if (child.id === node_id) {
                _parentNode = outLayer as PageNode;
                _childrenNodes = children;
                return;
              }
              if (child.children) {
                return findParentXx(child, node_id, allTree);
              }
            });
          }

          if (node.id === node_id) {
            _parentNode = tree;
          }
        }
        return;
      }

      if (item.children) {
        item.children.map((child) => {
          if (child.id === node_id) {
            _parentNode = item;
            return;
          }

          return item.pid && findParentXx(item, item.pid, allTree);
        });
      }

      return item.pid && findParentXx(item, item.pid, allTree);
    });
  }

  return [_parentNode, _childrenNodes];
}

export function findParentId(tree: PageNode, node_id: string, parentIds: string[], allTree: PageNode): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (tree.type === 'loop-container') {
    const { node } = tree;
    if (node && node.type === 'composed-node') {
      const { outLayer, children = [] } = node;
      if (outLayer && outLayer.id === node_id) {
        outLayer.pid && parentIds.push(outLayer.pid);
        outLayer.pid && findParentId(allTree, outLayer.pid, parentIds, allTree);
        return;
      }

      children.map((item) => {
        if (item.id === node_id) {
          if (outLayer && outLayer.pid && item.pid) {
            parentIds.push(outLayer.id);
            findParentId(allTree, item.pid, parentIds, allTree);
          }
        }
      });
      return;
    }

    if (node && node.id === node_id) {
      node.pid && parentIds.push(node.pid);
      return;
    }
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
