export type BaseTreeNode<T> = {
  children?: T[];
  isLeaf?: boolean;
  disabled?: boolean;
  value: NumberString;
  label: React.ReactNode;
}

export interface Tree<T> {
  isChecked: boolean;
  indeterminate: boolean;
  isLeaf: boolean;
  disabled: boolean;
  children?: Tree<T>[];
  parent?: Tree<T>;
  origin: T;
}

export function initTree<T extends BaseTreeNode<T>>(options: T[], hasLoad: boolean, parent?: Tree<T>): Tree<T>[] {
  return options.map(option => {
    const transformOption: Tree<T> = {
      isChecked: false,
      indeterminate: false,
      isLeaf: isLeaf(option, hasLoad),
      disabled: !!option.disabled,
      origin: option,
      parent
    }
    if (option.children) {
      transformOption.children = initTree(option.children, hasLoad, transformOption)
    }
    return transformOption;
  })
}

export function isLeaf<T extends BaseTreeNode<T>>(originNode: T, hasLoad: boolean): boolean {
  if (hasLoad) return !!originNode.isLeaf;
  return !originNode.children;
}

export function getTreeNodeByOrigin<T extends BaseTreeNode<T>>(forest: Tree<T>[], originNode: T): Tree<T> | undefined {
  let treeNode: Tree<T> | undefined;
  eachForest(forest, (node: Tree<T>) => {
    if (node.origin !== originNode) return;
    treeNode = node;
    return true;
  });
  return treeNode;
}

type MultipleOriginInfo<T> = {
  origins: T[][];
  value: NumberString[][];
  label: React.ReactNode[][];
}
type SingleOriginInfo<T> =  {
  origins: T[];
  value: NumberString[];
  label: React.ReactNode[];
}
type OriginInfo<T> = MultipleOriginInfo<T> | SingleOriginInfo<T>;

export function getOriginInfoByPath<T extends BaseTreeNode<T>>(path: Tree<T>[] | Tree<T>[][]): OriginInfo<T> {
  if (!isSinglePath(path)) {
    const origins: T[][] = [];
    const value: NumberString[][] = [];
    const label: React.ReactNode[][] = [];
    path.forEach(singlePath => {
      origins.push(singlePath.map(({ origin }) => origin));
      value.push(singlePath.map(({ origin }) => origin.value));
      label.push(singlePath.map(({ origin }) => origin.label));
    });
    return { origins, value, label };
  } else {
    const origins: T[] = [];
    const value: NumberString[] = [];
    const label: React.ReactNode[] = [];
    path.forEach(({ origin }) => {
      origins.push(origin);
      value.push(origin.value);
      label.push(origin.label);
    });
    return { origins, value, label };
  }
}

export function eachForest<T extends BaseTreeNode<T>>(forest: Tree<T>[], callbackFn: (treeNode: Tree<T>) => boolean | void): void {
  forest.forEach(treeNode => {
    const isBreak = callbackFn(treeNode);
    if (!isBreak && treeNode.children) {
      eachForest(treeNode.children, callbackFn);
    }
  });
}

export function eachParent<T extends BaseTreeNode<T>>(treeNode: Tree<T>, callbackFn: (treeNode: Tree<T>) => void): void {
  let parentNode = treeNode.parent;
  while (parentNode) {
    callbackFn(parentNode);
    parentNode = parentNode.parent;
  }
}

export function isMultiple(model: CascaderModelType): boolean {
  return ['multiple', 'unlink'].includes(model);
}

export function isSinglePath<T extends BaseTreeNode<T>>(path: Tree<T>[] | Tree<T>[][]): path is Tree<T>[] {
  return isObject(path[0]);
}

export function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function getMultiplePathByNodes<T extends BaseTreeNode<T>>(nodes: Tree<T>[]): Tree<T>[][] {
  const path: Tree<T>[][] = [];
  nodes.forEach(node => {
    const singlePath = [node];
    eachParent(node, (parentNode) => singlePath.unshift(parentNode));
    path.push(singlePath);
  });
  return path;
}

interface SearchPathsProps<T> extends ShowSearchType {
  forest: Tree<T>[];
  model: CascaderModelType;
  searchText: string;
};
export function searchPaths<T extends BaseTreeNode<T>>({
  forest,
  model,
  searchText,
  filter,
  sort,
  limit
}: SearchPathsProps<T>): Tree<T>[][] {
  if (!searchText) return [];
  const searchNodes: Tree<T>[] = [];
  eachForest(forest, (treeNode) => {
    if (model === 'single') {
      if ((treeNode.origin.label as string).match(searchText)) {
        searchNodes.push(...getLeafsByNode(treeNode));
        return true;
      }
    } else {
      if ((treeNode.origin.label as string).match(searchText)) {
        searchNodes.push(treeNode);
      }
    }
  });

  let paths = getMultiplePathByNodes(searchNodes);

  if (filter) {
    paths = paths.filter(singlePath => {
      const { origins } = getOriginInfoByPath(singlePath);
      return filter(searchText, origins as T[]);
    })
  }
  if (sort) {
    paths = paths.sort((pre, cur) => {
      const { origins: preOrigins } = getOriginInfoByPath(pre);
      const { origins: curOrigins } = getOriginInfoByPath(cur);
      return sort(preOrigins as T[], curOrigins as T[], searchText);
    })
  }
  if (limit) {
    paths = paths.slice(0, limit);
  }

  return paths;
}

function getLeafsByNode<T extends BaseTreeNode<T>>(node: Tree<T>): Tree<T>[] {
  const leafs: Tree<T>[] = [];
  if (node.children) {
    node.children.forEach(childNode => {
      leafs.push(...getLeafsByNode(childNode));
    });
  } else {
    leafs.push(node);
  }
  return leafs;
}
