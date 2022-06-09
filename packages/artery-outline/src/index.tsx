import React, { useMemo } from 'react';
import { fromJS, removeIn } from 'immutable';
import ReactDOM from 'react-dom';
import { Node } from '@one-for-all/artery';
import { useState } from 'react';
import {
  deleteByID,
  ImmutableNode,
  patchNode,
  _insertChildAt,
  _insertLeftSiblingTo,
  _insertRightSiblingTo,
} from '@one-for-all/artery-utils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { logger } from '@one-for-all/utils';
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useSensor,
  MouseSensor,
  useSensors,
} from '@dnd-kit/core';

import RootEntry from './root-entry';
import RenderEntry from './render-entry';
import { getProjectionDepth, insertBelowTo, pairToEntry, useFlattenNodes } from './utils';
import { CollapsedStatus, NodePrimary } from './types';
import { adjustTranslate, dropAnimationConfig, measuring, mouseSensorOptions } from './constants';

import './index.scss';

export interface Props {
  rootNode: Node;
  activeNode?: Node;
  onActiveNodeChange: (activeNode: Node) => void;
  onChange: (node: Node) => void;
  isContainer: (node: NodePrimary) => boolean;
}

function Outline({
  rootNode,
  isContainer,
  onChange,
  activeNode,
  onActiveNodeChange,
}: Props): JSX.Element | null {
  const [collapsedNodeIDs, setCollapsedNodeIDs] = useState(new Set<string>([]));
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

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (!over || over.id === active.id) {
      return;
    }

    const draggingIndex = entries.findIndex(({ id }) => id === active.id);
    const overIndex = entries.findIndex(({ id }) => id === over.id);
    if (draggingIndex === -1 || overIndex === -1) {
      logger.error(
        `[artery-outline] fatal error, can not find over entry [${over.id}] or dragging entry [${active.id}]`,
      );
      return;
    }

    // 将 entry 向下拖动时，预期释放的位置在 `over` 下方
    // 将 entry 向上拖动时，预期释放的位置在 `over` 上方
    // 口诀：上上下下
    const draggingDirection = draggingIndex < overIndex ? 'below' : 'above';

    let _rootNode: ImmutableNode | undefined = fromJS(rootNode);
    const draggingNodeKeyPath = flattenNodePairs.find(([, node]) => node.getIn(['id']) === draggingId)?.[0];
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

    _rootNode = removeIn(_rootNode, draggingNodeKeyPath);

    const overNodeKeyPath = flattenNodePairs.find(([, node]) => node.getIn(['id']) === over.id)?.[0];
    if (!overNodeKeyPath) {
      logger.error('[artery-outline] fatal error, can not find overNodeKeyPath of', over.id);
      return;
    }

    if (draggingDirection === 'below') {
      _rootNode = insertBelowTo(
        _rootNode,
        entries[overIndex],
        projectionDepth,
        draggingNode as ImmutableNode,
      );

      onChangeWithLog(_rootNode);
      return;
    }

    const entryAboveOverEntry = entries[Math.max(overIndex - 1, 0)];
    _rootNode = insertBelowTo(_rootNode, entryAboveOverEntry, projectionDepth, draggingNode as ImmutableNode);

    onChangeWithLog(_rootNode);
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

  function handleEntryClick(id: string): void {
    onActiveNodeChange(
      flattenNodePairs.find(([_, node]) => node.getIn(['id']) === id)?.[1].toJS() as unknown as Node,
    );
  }

  if (!entries.length) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={({ active: { id: activeId } }: DragStartEvent) => {
        setDraggingId(activeId as string);
        document.body.style.setProperty('cursor', 'grabbing');
      }}
      onDragMove={({ delta }) => setOffsetLeft(delta.x)}
      onDragOver={({ over }) => setOverId(over?.id.toString() ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => resetState()}
    >
      <RootEntry
        id={entries[0].id}
        name={entries[0].name}
        iconRender={() => <span>i</span>}
        isSelected={activeNode?.id === entries[0].id}
        onClick={() => handleEntryClick(entries[0].id)}
        onNameChange={(newName) => {
          rootNode.label = newName;
          onChange({ ...rootNode });
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
              onClick={() => handleEntryClick(id)}
              isSelected={activeNode?.id === id}
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
