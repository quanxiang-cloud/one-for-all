declare module '@one-for-all/schema-utils' {
  export type List<T> = import('immutable').List<T>;
  export type ImmutableNode = import('immutable').Collection<unknown, unknown>;
  export type KeyPath = import('immutable').Seq.Indexed<string | number>;
  export type IdPath = import('immutable').Seq.Indexed<string>;
  export type IdOrKeyPath = string | KeyPath;
  type SchemaNode = import('@one-for-all/schema-spec').SchemaNode;

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
    htmlNode: (currentNode: import('@one-for-all/schema-spec').HTMLNode) => void;
    reactComponentNode: (currentNode: import('@one-for-all/schema-spec').ReactComponentNode) => void;
    loopContainerNode: (currentNode: import('@one-for-all/schema-spec').LoopContainerNode) => void;
    composedNode: (currentNode: import('@one-for-all/schema-spec').ComposedNode) => void;
    refNode: (currentNode: import('@one-for-all/schema-spec').RefNode) => void;
    jsxNode: (currentNode: import('@one-for-all/schema-spec').JSXNode) => void;
    routeNode: (currentNode: import('@one-for-all/schema-spec').RouteNode) => void;
  }>;
  export function travel(schemaNode: SchemaNode, Visitors: Visitors): void;
  export function getNodeParentIDs(schemaNode: SchemaNode, id: string): string[] | undefined;
  export function findNodeByID(schemaNode: SchemaNode, id: string): SchemaNode | undefined;
  export function appendChild(schemaNode: SchemaNode, parentID: string, child: SchemaNode): SchemaNode | undefined;
  export function patchNode(schemaNode: SchemaNode, partialNode: Partial<SchemaNode>): SchemaNode | undefined;
  export function deleteByID(schemaNode: SchemaNode, id: string): SchemaNode;
}
