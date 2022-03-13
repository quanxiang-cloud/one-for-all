declare module '@one-for-all/schema-utils' {
  export type List = import('immutable').List;
  export type ImmutableNode = import('immutable').Collection<unknown, unknown>;
  export type KeyPath = import('immutable').Seq.Indexed<string | number>;
  export type IdPath = import('immutable').Seq.Indexed<string>;
  export type IdOrKeyPath = string | KeyPath;

  export type WalkIterator<T, StopValue = unknown> = (
    accumulator: T | undefined,
    keyPath: Seq.Indexed<string | number>,
    stop: (value: StopValue) => StopValue,
  ) => T;

  export type Comparator = (currentNode: ImmutableNode, keyPath: KeyPath) => boolean;

  export type ancestors = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => List<KeyPath> | undefined;
  export type byArbitrary = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type childAt = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath, index: number) => KeyPath | undefined;
  export type depth = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => number | undefined;
  export type filter = (node: ImmutableNode, comparator: Comparator) => List<KeyPath>;
  export type find = (node: ImmutableNode, comparator: Comparator) => KeyPath | undefined;
  export type firstChild = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type hasChildNodes = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => boolean;
  export type id = (node: ImmutableNode, keyPath: KeyPath) => string | undefined;
  export type keyPathById = (node: ImmutableNode, id: string) => KeyPath | undefined;
  export type lastChild = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type left = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type nextSibling = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type nodes = (node: ImmutableNode) => List<KeyPath>;
  export type parent = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type parentIdPath = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type previousSibling = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type right = (node: ImmutableNode, idOrKeyPath: IdOrKeyPath) => KeyPath | undefined;
  export type walk<T, Stop = unknown> = (node: ImmutableNode, iterator: WalkIterator<T, Stop>) => T | Stop | undefined;
}
