import { useState, useEffect } from "react";

import { isMultiple, eachForest, eachParent, initTree, BaseTreeNode, Tree } from './utils';

type TreeValueType = NumberString | NumberString[];

type UseTreeReturn<T> = {
  forest: Tree<T>[];
  changeChecked: (treeNode: Tree<T>, isChecked: boolean) => void;
  clear: () => void;
};

export function useTree<T extends BaseTreeNode<T>>({origin, defaultValue, model, hasLoad, onChange} :
  {
    origin: T[];
    defaultValue?: TreeValueType;
    model: CascaderModelType;
    hasLoad?: boolean;
    onChange?: (forest: Tree<T>[]) => void;
  }): UseTreeReturn<T> {
  const [forest, setForest] = useState<Tree<T>[]>([]);

  useEffect(() => {
    const resetForest = initTree(origin, !!hasLoad);
    syncTreeCheckedByValue(resetForest, defaultValue || []);
    setForest(resetForest);
  }, [origin])

  useEffect(() => {
    onChange?.(forest);
  }, [forest]);

  function syncTreeCheckedByValue(forest: Tree<T>[], value: NumberString | NumberString[]) {
    if (!value) return [];
    if (isMultiple(model)) {
      eachForest(forest, (treeNode) => {
        if ((value as NumberString[]).includes(treeNode.origin.value)) {
          changeChecked(treeNode, true, forest);
        }
      });
    } else {
      eachForest(forest, (treeNode) => {
        if (treeNode.origin.value === value as NumberString) {
          changeChecked(treeNode, true, forest);
          return true;
        }
      });
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

  function changeChecked(treeNode: Tree<T>, isChecked: boolean, changeForest?: Tree<T>[]): void {
    if (treeNode.isChecked === isChecked || treeNode.disabled) return;

    if (!isMultiple(model)) {
      eachForest(changeForest || forest, (treeNode) => {
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

    !changeForest && setForest([...forest]);
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
      getMultipleCheckNodes(forest).forEach(treeNode => changeChecked(treeNode, false));
    } else {
      forest.filter(({ isChecked, indeterminate }) => isChecked || indeterminate)
        .forEach(treeNode => changeChecked(treeNode, false));
    }
  }

  return {
    forest,
    changeChecked,
    clear,
  }
}
