declare module '@one-for-all/artery-utils' {
  export type List<T> = import('immutable').List<T>;
  export type ImmutableNode = import('immutable').Collection<unknown, unknown>;
  export type KeyPath = import('immutable').Seq.Indexed<string | number>;
  export type IdPath = import('immutable').Seq.Indexed<string>;
  export type IdOrKeyPath = string | KeyPath;
  type Node = import('@one-for-all/artery').Node;

  export type WalkIterator<T, StopValue = unknown> = (
    accumulator: T | undefined,
    keyPath: KeyPath,
    stop: (value: StopValue) => StopValue,
  ) => T;

  export type Comparator = (currentNode: ImmutableNode, keyPath: KeyPath) => boolean;

  export function ancestors(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): List<KeyPath> | undefined;
  export function byArbitrary(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function childAt(node: ImmutableNode, idOrKeyPath: IdOrKeyPath, index: number): KeyPath | undefined;
  export function depth(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): number | undefined;
  export function filter(node: ImmutableNode, comparator: Comparator): List<KeyPath>;
  export function find(node: ImmutableNode, comparator: Comparator): KeyPath | undefined;
  export function firstChild(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function hasChildNodes(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): boolean;
  export function id(node: ImmutableNode, keyPath: KeyPath): string | undefined;
  export function keyPathById(node: ImmutableNode, id: string): KeyPath | undefined;
  export function lastChild(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function left(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function nextSibling(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function nodes(node: ImmutableNode): List<KeyPath>;
  export function parent(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function parentIdPath(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function previousSibling(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function right(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function walk<T, Stop = unknown>(
    node: ImmutableNode,
    iterator: WalkIterator<T, Stop>,
  ): T | Stop | undefined;

  export type Visitors = Partial<{
    htmlNode: (currentNode: import('@one-for-all/artery').HTMLNode) => void;
    reactComponentNode: (currentNode: import('@one-for-all/artery').ReactComponentNode) => void;
    loopContainerNode: (currentNode: import('@one-for-all/artery').LoopContainerNode) => void;
    composedNode: (currentNode: import('@one-for-all/artery').ComposedNode) => void;
    refNode: (currentNode: import('@one-for-all/artery').RefNode) => void;
    jsxNode: (currentNode: import('@one-for-all/artery').JSXNode) => void;
    routeNode: (currentNode: import('@one-for-all/artery').RouteNode) => void;
  }>;
  export function travel(node: Node, Visitors: Visitors): void;
  export function getNodeParentIDs(node: Node, id: string): string[] | undefined;
  export function findNodeByID(node: Node, id: string): Node | undefined;
  export function appendChild(node: Node, parentID: string, child: Node): Node | undefined;
  export function patchNode(node: Node, partialNode: Partial<Node>): Node | undefined;
  export function deleteByID(node: Node, id: string): Node;
  export function getNodeParents(node: Node, id: string): Node[] | undefined;
  /**
   *
   * @param root Root node
   * @param referenceNodeID insert before this node
   * @param node node to be inserted
   * @returns New root, or undefined if insert failed
   */
  export function insertBefore(root: Node, referenceNodeID: string, node: Node): Node | undefined;
  /**
   *
   * @param root Root node
   * @param referenceNodeID insert after this node
   * @param node node to be inserted
   * @returns New root, or undefined if insert failed
   */
  export function insertAfter(root: Node, referenceNodeID: string, node: Node): Node | undefined;
  /**
   *
   * @param root Root node
   * @param parentNodeID
   * @param index inserted at this index
   * @param node
   * @returns New root, or undefined if insert failed
   */
  export function insertAt(root, parentNodeID, index, node): Node | undefined;
}
