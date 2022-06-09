import { useMemo } from 'react';
import { Node } from '@one-for-all/artery';
import {
  ancestors,
  ImmutableNode,
  KeyPath,
  _flat,
  _insertChildAt,
  _insertRightSiblingTo,
} from '@one-for-all/artery-utils';
import { fromJS, List } from 'immutable';
import { arrayMove } from '@dnd-kit/sortable';
import { logger } from '@one-for-all/utils';

import { INDENTATION_WIDTH } from './constants';
import { Entry, NodePrimary } from './types';

const NODE_TYPE_WHITE_LIST = ['html-element', 'react-component', 'loop-container'];

export function useFlattenNodes(
  rootNode: Node,
  collapsedNodeIDs: string[],
  draggingId?: string,
): Array<[KeyPath, ImmutableNode]> {
  const rawPairs = useMemo(() => {
    let pairs: Array<[KeyPath, ImmutableNode]> = _flat(fromJS(rootNode)).slice();
    for (let i = 0; i < pairs.length; ) {
      const nodeType = pairs[i][1].getIn(['type']);
      if (NODE_TYPE_WHITE_LIST.includes(nodeType as string)) {
        i = i + 1;
        continue;
      }

      const keyPathStr: string = pairs[i][0].toJS().join('/');
      while (pairs[i]?.[0].toJS().join('/').startsWith(keyPathStr)) {
        pairs.splice(i, 1);
      }
    }

    return pairs;
  }, [rootNode]);

  return useMemo(() => {
    let _rawPairs = rawPairs.slice();
    const idsShouldRemoveChildren = draggingId
      ? [draggingId, ...Array.from(collapsedNodeIDs)]
      : Array.from(collapsedNodeIDs);

    for (const id of idsShouldRemoveChildren) {
      const parentIndex = _rawPairs.findIndex(([_, n]) => n.getIn(['id']) === id);
      if (parentIndex === -1) {
        continue;
      }

      const [keyPath] = _rawPairs[parentIndex];
      const keyPathStr = keyPath.toJS().join('/');
      let lastDeleteIndex = parentIndex;
      for (let i = lastDeleteIndex + 1; i < _rawPairs.length; i += 1) {
        if (_rawPairs[i][0].toJS().join('/').startsWith(keyPathStr)) {
          lastDeleteIndex = i;
          continue;
        }

        break;
      }

      _rawPairs.splice(parentIndex + 1, lastDeleteIndex - parentIndex);
    }

    return _rawPairs;
  }, [draggingId, collapsedNodeIDs, rawPairs]);
}

export function pairToEntry(
  [keyPath, n]: [KeyPath, ImmutableNode],
  isContainer: (node: NodePrimary) => boolean,
): Entry {
  const id = n.getIn(['id']) as string;
  const primaryNode: NodePrimary = {
    type: n.getIn(['type']),
    name: n.getIn(['name']),
    packageName: n.getIn(['packageName']),
    packageVersion: n.getIn(['packageVersion']),
    exportName: n.getIn(['exportName']),
  } as NodePrimary;

  const _keyPath = keyPath.toArray().filter((path) => path === 'children' || path === 'nodes');

  return {
    id: id,
    name: (n.getIn(['label']) as string) || id,
    depth: _keyPath.length,
    isContainer: isContainer(primaryNode),
  };
}

export function getProjectionDepth(
  entries: Entry[],
  draggingId: string,
  overId: string,
  dragOffset: number,
): number {
  const overEntryIndex = entries.findIndex(({ id }) => id === overId);
  const draggingEntryIndex = entries.findIndex(({ id }) => id === draggingId);
  const draggingEntry = entries[draggingEntryIndex];
  const newEntries = arrayMove(entries, draggingEntryIndex, overEntryIndex);

  const previousEntry = newEntries[overEntryIndex - 1];
  const nextEntry = newEntries[overEntryIndex + 1];
  const dragDepth = Math.round(dragOffset / INDENTATION_WIDTH);
  const projectedDepth = draggingEntry.depth + dragDepth;

  const maxDepth = getMaxDepth(previousEntry);
  const minDepth = nextEntry ? nextEntry.depth : 0;

  let depth = projectedDepth;
  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return depth;
}

function getMaxDepth(entry?: Entry): number {
  if (!entry) {
    return 0;
  }

  return entry.isContainer ? entry.depth + 1 : entry.depth;
}

export function insertBelowTo(
  rootNode: ImmutableNode,
  targetEntry: Entry,
  projectedDepth: number,
  node: ImmutableNode,
): ImmutableNode | undefined {
  if (projectedDepth === targetEntry.depth) {
    logger.debug(`[artery-outline] move [${node.getIn(['id'])}] to right of [${targetEntry.id}]`);

    return _insertRightSiblingTo(rootNode, targetEntry.id, node);
  }

  if (projectedDepth > targetEntry.depth) {
    logger.debug(
      `[artery-outline] move [${node.getIn(['id'])}] to the first position of [${targetEntry.id}]'s children`,
    );

    return _insertChildAt(rootNode, targetEntry.id, 0, node);
  }

  const parentIndex = targetEntry.depth - projectedDepth - 1;
  const parentList = ancestors(rootNode, targetEntry.id) || List();
  if (!parentList || !parentList.size) {
    logger.error(`[artery-outline] fatal error, can not find over node parents`);
    return;
  }

  const parentKeyPath = parentList.get(parentIndex);
  if (!parentKeyPath) {
    logger.error(`[artery-outline] fatal error, no ancestor at index ${parentIndex}`);
    return;
  }

  logger.debug(`[artery-outline] move [${node.getIn(['id'])}] to right of [${parentKeyPath.toJS()}]`);

  return _insertRightSiblingTo(rootNode, parentKeyPath, node);
}
