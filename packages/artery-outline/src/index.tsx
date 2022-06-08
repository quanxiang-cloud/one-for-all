import React, { useMemo } from 'react';
import { fromJS, removeIn } from 'immutable';
import ReactDOM from 'react-dom';
import { Node } from '@one-for-all/artery';
import { useState } from 'react';
import {
  ancestors,
  byArbitrary,
  deleteByID,
  ImmutableNode,
  patchNode,
  _insertChildAt,
  _insertRightSiblingTo,
} from '@one-for-all/artery-utils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { logger } from '@one-for-all/utils';
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  useSensor,
  MouseSensor,
  useSensors,
} from '@dnd-kit/core';

import RootEntry from './root-entry';
import RenderEntry from './render-entry';
import { getProjectionDepth, pairToEntry, useFlattenNodes } from './utils';
import { CollapsedStatus, NodePrimary, Entry } from './types';
import { adjustTranslate, dropAnimationConfig, measuring, mouseSensorOptions } from './constants';

import './index.scss';

export interface Props {
  rootNode: Node;
  onChange: (node: Node) => void;
  isContainer: (node: NodePrimary) => boolean;
}

function Outline({ rootNode, isContainer, onChange }: Props): JSX.Element | null {
  const [collapsedNodeIDs, setCollapsedNodeIDs] = useState(new Set<string>([]));
  const [selectedID, setSelectedID] = useState('');
  const [draggingId, setDraggingId] = useState('');
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [overId, setOverId] = useState<string | null>(null);
  const flattenNodePairs = useFlattenNodes(rootNode, Array.from(collapsedNodeIDs), draggingId);
  const entries = flattenNodePairs.map(([keyPath, n]) => pairToEntry([keyPath, n], isContainer));
  const entryIDs = useMemo(() => entries.map(({ id }) => id), [entries]);
  const draggingEntry = useMemo(() => entries.find(({ id }) => id === draggingId), [draggingId]);
  const mouseSensor = useSensor(MouseSensor, mouseSensorOptions);

  const sensors = useSensors(mouseSensor);
  const projectionDepth = useMemo(() => {
    if (!draggingId || !overId) {
      return 0;
    }

    return getProjectionDepth(entries, draggingId, overId, offsetLeft);
  }, [entries, draggingId, overId, offsetLeft]);

  function onChangeWithLog(node?: ImmutableNode): void {
    if (!node) {
      logger.error('[artery-outline] ignored for calling onChange by a undefined rootNode.');
      return;
    }

    onChange(node.toJS() as unknown as Node);
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setDraggingId(activeId as string);
    // setOverId(activeId);

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id.toString() ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (!over || over.id === active.id) {
      return;
    }

    const overEntry = entries.find(({ id }) => id === over.id);
    if (!overEntry) {
      logger.error('[artery-outline] fatal error, can not find over entry for id:', over.id);
      return;
    }

    let _rootNode: ImmutableNode | undefined = fromJS(rootNode);
    const draggingNodeKeyPath = byArbitrary(_rootNode, draggingId);
    if (!draggingNodeKeyPath) {
      logger.error('[artery-outline] fatal error, can not find dragging node keyPath of', draggingId);
      return;
    }

    const draggingNode = _rootNode.getIn(draggingNodeKeyPath);
    if (!draggingNode) {
      logger.error(
        '[artery-outline] fatal error, can not find dragging node of keyPath',
        draggingNodeKeyPath.toJS(),
      );
      return;
    }

    const overNodeKeyPath = byArbitrary(_rootNode, overEntry.id);
    if (!overNodeKeyPath) {
      logger.error('[artery-outline] fatal error, can not find overNodeKeyPath of', overEntry.id);
      return;
    }

    _rootNode = removeIn(_rootNode, draggingNodeKeyPath);

    if (projectionDepth > overEntry.depth) {
      logger.debug(`[artery-outline] move [${draggingId}] to the first position of [${over.id}]'s children`);
      _rootNode = _insertChildAt(_rootNode, overNodeKeyPath, 0, draggingNode as ImmutableNode);
      onChangeWithLog(_rootNode);
      return;
    }

    if (projectionDepth === overEntry.depth) {
      logger.debug(`[artery-outline] move [${draggingId}] to right of [${over.id}]`);
      _rootNode = _insertRightSiblingTo(_rootNode, overNodeKeyPath, draggingNode as ImmutableNode);
      onChangeWithLog(_rootNode);
      return;
    }

    const parentIndex = overEntry.depth - projectionDepth - 1;
    const parentList = ancestors(_rootNode, overNodeKeyPath);
    if (!parentList || !parentList.size) {
      logger.error(`[artery-outline] fatal error, can not find over node parents`);
      return;
    }

    const parentKeyPath = parentList.reverse().get(parentIndex);
    if (!parentKeyPath) {
      logger.error(`[artery-outline] fatal error, no ancestor at index ${parentIndex}`);
      return;
    }

    logger.debug(`[artery-outline] move [${draggingId}] to right of [${parentKeyPath.toJS()}]`);
    _rootNode = _insertRightSiblingTo(_rootNode, parentKeyPath, draggingNode as ImmutableNode);
    onChangeWithLog(_rootNode);

    // if (projected && over) {
    //   const {depth, parentId} = projected;
    //   const clonedItems: FlattenedItem[] = JSON.parse(
    //     JSON.stringify(flattenTree(items))
    //   );
    //   const overIndex = clonedItems.findIndex(({id}) => id === over.id);
    //   const activeIndex = clonedItems.findIndex(({id}) => id === active.id);
    //   const activeTreeItem = clonedItems[activeIndex];

    //   clonedItems[activeIndex] = {...activeTreeItem, depth, parentId};

    //   const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
    //   const newItems = buildTree(sortedItems);

    //   setItems(newItems);
    // }
  }

  function resetState() {
    setOverId(null);
    setDraggingId('');
    setOffsetLeft(0);
    // setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function removeNode(id: string): void {
    onChange(deleteByID(rootNode, id));
  }

  function toggleCollapse(id: string): void {
    if (collapsedNodeIDs.has(id)) {
      collapsedNodeIDs.delete(id);
    } else {
      collapsedNodeIDs.add(id);
    }

    setCollapsedNodeIDs(new Set(Array.from(collapsedNodeIDs)));
  }

  if (!entries.length) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => resetState()}
    >
      <RootEntry
        id={entries[0].id}
        name={entries[0].name}
        iconRender={() => <span>i</span>}
        isSelected={selectedID === entries[0].id}
        onNameChange={(newName) => {
          rootNode.label = newName;
          onChange(rootNode);
        }}
      />
      <SortableContext items={entryIDs.slice(1)} strategy={verticalListSortingStrategy}>
        {entries.slice(1).map(({ id, name, depth, isContainer }) => {
          let collapsedStatus: CollapsedStatus = 'none';
          if (isContainer) {
            collapsedStatus = collapsedNodeIDs.has(id) ? 'collapsed' : 'expended';
          }

          return (
            <RenderEntry
              key={id}
              id={id}
              name={name}
              isSelected={selectedID === id}
              isDragging={draggingId === id}
              iconRender={() => <span>i</span>}
              depth={draggingId === id ? projectionDepth : depth}
              collapsedStatus={collapsedStatus}
              onCollapse={() => toggleCollapse(id)}
              onRemove={() => removeNode(id)}
              onNameChange={(newName) => {
                const newRoot = patchNode(rootNode, { id, label: newName });
                if (newRoot) {
                  onChange(newRoot);
                }
              }}
            />
          );
        })}
        {ReactDOM.createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[adjustTranslate]}>
            {draggingId && draggingEntry && (
              <div className="dragging-entry-overlay">{draggingEntry.name}</div>
            )}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}

export default Outline;
