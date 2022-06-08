import { useMemo, useState } from 'react';
import { Node } from '@one-for-all/artery';
import { ImmutableNode, KeyPath, _flat } from '@one-for-all/artery-utils';
import { fromJS } from 'immutable';
import { arrayMove } from '@dnd-kit/sortable';

import { INDENTATION_WIDTH } from './constants';
import { Entry, NodePrimary } from './types';

export function useFlattenNodes(
  rootNode: Node,
  collapsedNodeIDs: string[],
  draggingId?: string,
): Array<[KeyPath, ImmutableNode]> {
  const rawPairs = useMemo(() => _flat(fromJS(rootNode)), [rootNode]);

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
