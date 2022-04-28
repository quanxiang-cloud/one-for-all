import { useState, useEffect } from "react";

import { isMultiple, eachForest, eachParent, initTree, getMultiplePathByNodes, BaseTreeNode, Tree } from './utils';

type TreeValueType = NumberString[] | NumberString[][];

type UseTreeReturn<T> = {
  forest: Tree<T>[];
  checked: (treeNode: Tree<T>, isChecked: boolean) => void;
  clear: () => void;
};

export function useTree<T extends BaseTreeNode<T>>({origin, defaultValue, model, hasLoad, onChange} :{
  origin: T[];
  defaultValue?: TreeValueType;
  model: CascaderModelType;
  hasLoad?: boolean;
  onChange?: (path: Tree<T>[] | Tree<T>[][]) => void;
}): UseTreeReturn<T> {
  const [forest, setForest] = useState<Tree<T>[]>([]);

  useEffect(() => {
    const resetForest = initTree(origin, !!hasLoad);
    syncTreeCheckedByValue(resetForest, defaultValue || []);
    setForest(resetForest,);
  }, [origin])

  useEffect(() => {
    onChange?.(getPathByChecked());
  }, [forest]);

  function syncTreeCheckedByValue(tree: Tree<T>[], value: TreeValueType): void {
    if (value.length === 0) return;
    if (isMultiple(model)) {
      (value as NumberString[][]).forEach(singleValue => {
        const path = getSinglePathByValue(tree, singleValue);
        if (path.length === singleValue.length && singleValue.length !== 0) {
          checked(path[path.length - 1], true);
        }
      });
    } else {
      const path = getSinglePathByValue(tree, value as NumberString[]);
      path.forEach(node => node.isChecked = true);
    }
  }

  function getSinglePathByValue(tree: Tree<T>[], value: NumberString[]): Tree<T>[] {
    if (value.length === 0) return [];
    const path: Tree<T>[] = [];
    let currentTree = tree;
    for (let i= 0; i < value.length; i++) {
      const currentBranch = currentTree.find(branch => branch.origin.value === value[i]);
      if (!currentBranch) break;
      path.push(currentBranch);
      if (!currentBranch.children) break;
      currentTree = currentBranch.children;
    }
    return path;
  }

  function getPathByChecked(): Tree<T>[] | Tree<T>[][] {
    if (isMultiple(model)) {
      const multipleCheckNodes = getMultipleCheckNodes(forest);
      return getMultiplePathByNodes(multipleCheckNodes);
    } else {
      let currentCheckedNode = forest.find(({ isChecked }) => isChecked);
      const path: Tree<T>[] = [];
      while (currentCheckedNode) {
        path.push(currentCheckedNode);
        currentCheckedNode = currentCheckedNode.children?.find(({ isChecked }) => isChecked);
      }
      return path;
    }
  }

  function getMultipleCheckNodes(forest: Tree<T>[]): Tree<T>[] {
    const checked: Tree<T>[] = [];
    eachForest(forest, (treeNode) => {
      if (treeNode.isChecked) {
        checked.push(treeNode);
      }
      // If indeterminate=false, it means that its children is not selected, so need't to traverse the children.
      return !treeNode.indeterminate;
    });
    return checked;
  }

  function checked(treeNode: Tree<T>, isChecked: boolean): void {
    if (treeNode.isChecked === isChecked || treeNode.disabled) return;

    if (!isMultiple(model)) {
      eachForest(forest, (treeNode) => {
        const currentIsChecked = treeNode.isChecked;
        treeNode.isChecked = false;
        return !currentIsChecked;
      });

      if (isChecked) {
        treeNode.isChecked = true;
        eachParent(treeNode, (treeNode) => treeNode.isChecked = true);
      }
    } else if (model === 'multiple') {
      eachForest([treeNode], (childNode) => {
        if (childNode.isChecked === isChecked || childNode.disabled) return true;

        childNode.isChecked = isChecked;
        childNode.indeterminate = false;
      });

      treeNode.parent && hasChildChangeChecked(treeNode.parent);
    } else {
      treeNode.isChecked = isChecked;

      eachParent(treeNode, (parentNode) => {
        parentNode.indeterminate = hasChildrenChecked(parentNode);
      });
    }
    setForest([...forest]);
  }

  function hasChildChangeChecked(treeNode: Tree<T>): void {
    if (isChildrenAllChecked(treeNode)) {
      treeNode.isChecked = true;
      treeNode.indeterminate = false;
    } else if (hasChildrenChecked(treeNode)) {
      treeNode.isChecked = false;
      treeNode.indeterminate = true;
    } else {
      treeNode.isChecked = false;
      treeNode.indeterminate = false;
    }
    if (treeNode.parent) {
      hasChildChangeChecked(treeNode.parent);
    }
  }

  function isChildrenAllChecked(treeNode: Tree<T>): boolean {
    let isAllChecked = true;
    treeNode.children?.forEach(childNode => {
      if (!childNode.isChecked) isAllChecked = false;
    });
    return isAllChecked;
  }

  function hasChildrenChecked(treeNode: Tree<T>): boolean {
    let hasChecked = false;
    treeNode.children?.forEach(childNode => {
      if (childNode.isChecked || childNode.indeterminate) hasChecked = true;
    });
    return hasChecked;
  }

  function clear(): void {
    if (isMultiple(model)) {
      getMultipleCheckNodes(forest).forEach(treeNode => checked(treeNode, false));
    } else {
      forest.filter(({ isChecked, indeterminate }) => isChecked || indeterminate)
        .forEach(treeNode => checked(treeNode, false));
    }
  }

  return {
    forest,
    checked,
    clear,
  }
}
