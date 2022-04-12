import React, { useState, useEffect } from "react";

type BaseTreeNode<T> = {
  children?: T[];
  isLeaf?: boolean;
  value: NumberString;
  label: React.ReactNode;
}

export interface Tree<T> {
  isChecked: boolean;
  indeterminate: boolean;
  isLeaf: boolean;
  children?: Tree<T>[];
  parent?: Tree<T>;
  origin: T;
}

type TreeValueType = NumberString[] | NumberString[][];

export function useTree<T extends BaseTreeNode<T>>({origin, defaultValue, isMultiple, hasLoad, onChange} :{
  origin: T[];
  defaultValue?: TreeValueType;
  isMultiple?: boolean;
  hasLoad?: boolean;
  onChange?: (path: Tree<T>[] | Tree<T>[][]) => void;
}) {
  const [forest, setForest] = useState<Tree<T>[]>([]);

  useEffect(() => {
    const resetForest = initTree(origin);
    syncTreeCheckedByValue(resetForest, defaultValue || []);
    setForest(resetForest);
  }, [origin])

  useEffect(() => {
    onChange?.(getPathByTreeChecked());
  }, [forest]);
  
  function initTree(options: T[], parent?: Tree<T>): Tree<T>[] {
    return options.map(option => {
      const transformOption: Tree<T> = {
        isChecked: false,
        indeterminate: false,
        isLeaf: isLeaf(option),
        origin: option,
        parent
      }
      if (option.children) {
        transformOption.children = initTree(option.children, transformOption)
      }
      return transformOption;
    })
  }

  function syncTreeCheckedByValue(tree: Tree<T>[], value: TreeValueType): void {
    if (value.length === 0) return;
    if (isMultiple) {
      (value as NumberString[][]).forEach(path => {
        const pathNodes = getNodesByValue(tree, path);
        if (pathNodes.length === path.length && path.length !== 0) {
          checked(pathNodes[pathNodes.length - 1], true);
        }
      });
    } else {
      const pathNodes = getNodesByValue(tree, value as NumberString[]);
      pathNodes.forEach(node => node.isChecked = true);
    }
  }

  function getNodesByValue(tree: Tree<T>[], path: NumberString[]): Tree<T>[] {
    if (path.length === 0) return [];
    const nodes: Tree<T>[] = [];
    let currentTree = tree;
    for (let i= 0; i < path.length; i++) {
      const currentBranch = currentTree.find(branch => branch.origin.value === path[i]);
      if (!currentBranch) break;
      nodes.push(currentBranch);
      if (!currentBranch.children) break;
      currentTree = currentBranch.children;
    }
    return nodes;
  }

  function getPathByTreeChecked(): Tree<T>[] | Tree<T>[][] {
    if (isMultiple) {
      const multipleLeaf = getMultipleLeaf(forest);
      return getMultiplePathByLeaf(multipleLeaf);
    } else {
      let currentCheckedNode = forest.find(treeNode => treeNode.isChecked);
      if (!currentCheckedNode) return [];
      return getPathByNodes(currentCheckedNode);
    }
  }

  function getPathByNodes(treeNode: Tree<T>): Tree<T>[] {
    let currentCheckedNode: Tree<T> | undefined = treeNode;
    const path: Tree<T>[] = [];
    while (currentCheckedNode) {
      path.push(currentCheckedNode);
      currentCheckedNode = currentCheckedNode.children?.find(({ isChecked }) => isChecked);
    }
    return path;
  }

  function getMultipleLeaf(forest: Tree<T>[]): Tree<T>[] {
    const checked: Tree<T>[] = [];
    forest.forEach(treeNode => {
      if (treeNode.isChecked) {
        checked.push(treeNode);
      } else if (treeNode.indeterminate) {
        checked.push(...getMultipleLeaf(treeNode.children || []));
      }
    })
    return checked;
  }

  function getMultiplePathByLeaf(leafs: Tree<T>[]): Tree<T>[][] {
    const path: Tree<T>[][] = [];
    leafs.forEach(leaf => {
      const singlePath = [];
      let currentNode: Tree<T> | undefined = leaf;
      while (currentNode) {
        singlePath.unshift(currentNode);
        currentNode = currentNode.parent;
      }
      path.push(singlePath);
    });
    return path;
  }

  function checked(treeNode: Tree<T>, isChecked: boolean): void {
    if (!isMultiple) {
      if (treeNode.isChecked === isChecked) return;

      let curTreeNode: Tree<T> | undefined = isChecked ? forest.find(treeNode => treeNode.isChecked) : treeNode;
      while (curTreeNode) {
        curTreeNode.isChecked = false;
        curTreeNode = curTreeNode.children?.find(treeNode => treeNode.isChecked);
      }
      if (isChecked) {
        curTreeNode = treeNode;
        while (curTreeNode) {
          curTreeNode.isChecked = true;
          curTreeNode = curTreeNode.parent;
        }
      }
    } else {
      treeNode.isChecked = isChecked;
      treeNode.indeterminate = false;

      treeNode.children?.forEach(childNode => {
        if (childNode.isChecked !== isChecked) {
          checked(childNode, isChecked);
        }
      });

      if (treeNode.parent)
        hasChildChangeChecked(treeNode.parent);
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
    if (!treeNode.children) return true;
    let isAllChecked = true;
    treeNode.children.forEach(childNode => {
      if (!childNode.isChecked) isAllChecked = false;
    });
    return isAllChecked;
  }

  function hasChildrenChecked(treeNode: Tree<T>): boolean {
    if (!treeNode.children) return false;
    let hasChecked = false;
    treeNode.children.forEach(childNode => {
      if (childNode.isChecked || childNode.indeterminate) hasChecked = true;
    });
    return hasChecked;
  }

  function clear(): void {
    forest.filter(({ isChecked, indeterminate }) => isChecked || indeterminate)
      .forEach(treeNode => checked(treeNode, false));
  }

  function getOriginInfo(checkedPath: Tree<T>[] | Tree<T>[][]) {
    if (isMultiple) {
      const pathOfOrigin: T[][] = [];
      const pathOfValue: NumberString[][] = [];
      const pathOfLabel: React.ReactNode[][] = [];
      (checkedPath as Tree<T>[][]).forEach(singlePath => {
        pathOfOrigin.push(singlePath.map(treeNode => treeNode.origin));
        pathOfValue.push(singlePath.map(({ origin }) => origin.value));
        pathOfLabel.push(singlePath.map(({ origin }) => origin.label));
      });
      return { pathOfOrigin, pathOfValue, pathOfLabel };
    } else {
      const pathOfOrigin: T[] = [];
      const pathOfValue: NumberString[] = [];
      const pathOfLabel: React.ReactNode[] = [];
      (checkedPath as Tree<T>[]).forEach(({ origin }) => {
        pathOfOrigin.push(origin);
        pathOfValue.push(origin.value);
        pathOfLabel.push(origin.label);
      });
      return { pathOfOrigin, pathOfValue, pathOfLabel };
    }
  }

  function isLeaf(originNode: T): boolean {
    if (hasLoad) return !!originNode.isLeaf;
    return !originNode.children;
  }

  return {
    forest,
    checked,
    clear,
    getOriginInfo,
  }
}
