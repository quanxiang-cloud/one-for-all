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

  export function exists(value: any): boolean;
  export function getChildNodeKey(node: ImmutableNode): string;
  export function _appendTo(root: ImmutableNode, parentIdOrKeyPath: IdOrKeyPath, node: Node | ImmutableNode): ImmutableNode | undefined;
  export function _insertChildAt(root: ImmutableNode, parentIdOrKeyPath: IdOrKeyPath, index: number, node: Node | ImmutableNode): ImmutableNode | undefined;
  export function _insertLeftSiblingTo(root: ImmutableNode, idOrKeyPath: IdOrKeyPath, node: Node | ImmutableNode): ImmutableNode | undefined;
  export function _insertRightSiblingTo(root: ImmutableNode, idOrKeyPath: IdOrKeyPath, node: Node | ImmutableNode): ImmutableNode | undefined;
  export function _prependTo(root: ImmutableNode, parentIdOrKeyPath: IdOrKeyPath, node: Node | ImmutableNode): ImmutableNode | undefined;

  export function ancestors(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): List<KeyPath> | undefined;
  export function byArbitrary(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function childAt(node: ImmutableNode, idOrKeyPath: IdOrKeyPath, index: number): KeyPath | undefined;
  export function depth(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): number | undefined;
  export function filter(node: ImmutableNode, comparator: Comparator): List<KeyPath>;
  export function find(node: ImmutableNode, comparator: Comparator): KeyPath | undefined;
  export function firstChild(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function hasChildNodes(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): boolean;
  export function nodeHasChildNodes(node: ImmutableNode): boolean;
  export function id(node: ImmutableNode, keyPath: KeyPath): string | undefined;
  export function keyPathById(node: ImmutableNode, id: string): KeyPath | undefined;
  export function lastChild(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function left(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function nextSibling(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function nodes(node: ImmutableNode): List<KeyPath>;
  export function parent(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function parentIdsSeq(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): import('immutable').Seq.Indexed<string> | undefined;
  export function previousSibling(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function right(node: ImmutableNode, idOrKeyPath: IdOrKeyPath): KeyPath | undefined;
  export function walk<T, Stop = unknown>(
    node: ImmutableNode,
    iterator: WalkIterator<T, Stop>,
  ): T | Stop | undefined;

  type HTMLNode = import('@one-for-all/artery').HTMLNode
  type ReactComponentNode = import('@one-for-all/artery').ReactComponentNode
  type LoopContainerNode = import('@one-for-all/artery').LoopContainerNode
  type ComposedNode = import('@one-for-all/artery').ComposedNode
  type RefNode = import('@one-for-all/artery').RefNode
  type JSXNode = import('@one-for-all/artery').JSXNode
  type RouteNode = import('@one-for-all/artery').RouteNode

  export type Visitors = Partial<{
    htmlNode: (currentNode: HTMLNode) => HTMLNode | undefined;
    reactComponentNode: (currentNode: ReactComponentNode) => ReactComponentNode | undefined;
    loopContainerNode: (currentNode: LoopContainerNode) => LoopContainerNode | undefined;
    composedNode: (currentNode: ComposedNode) => ComposedNode | undefined;
    refNode: (currentNode: RefNode) => RefNode | undefined;
    jsxNode: (currentNode: JSXNode) => JSXNode | undefined;
    routeNode: (currentNode: RouteNode) => RouteNode | undefined;
  }>;
  export function travel(node: Node, Visitors: Visitors): Node;
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
  export function insertAt(root: Node, parentNodeID: string, index: number, node: Node): Node | undefined;

  /**
   * Get the firstLevel `html-element` or `react-component` type children,
   * if the child's type is not one of above, this function will find child's children recursively.
   * @param parent Immutable type node
   * @returns an array of Immutable nodes
   */
  export function getFirstLevelConcreteChildren(parent: ImmutableNode): Array<ImmutableNode>;
}
