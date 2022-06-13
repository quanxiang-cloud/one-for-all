import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cs from 'classnames';

import { CollapsedStatus, NodePrimary } from './types';
import { INDENTATION_WIDTH, animateLayoutChanges } from './constants';
import { handleSVG, collapseIcon, removeSVG } from './icons';
import EntryNameInput from './entry-name-input';

interface Props {
  id: string;
  name: string;
  isSelected: boolean;
  iconRender: (node: NodePrimary) => JSX.Element;
  depth: number;
  onNameChange: (newName: string) => void;
  collapsedStatus: CollapsedStatus;
  onCollapse: () => void;
  onRemove: () => void;
  onClick: () => void;
}

function RenderEntry({
  id,
  name,
  isSelected,
  depth,
  onCollapse,
  collapsedStatus,
  onRemove,
  onNameChange,
  onClick,
}: Props): JSX.Element {
  const {
    attributes,
    isDragging,
    listeners,
    isSorting,
    isOver,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({ id, animateLayoutChanges });
  const [renaming, setRenaming] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    '--spacing': `${INDENTATION_WIDTH * (depth - 1)}px`,
    transition,
  } as React.CSSProperties;

  return (
    <div
      ref={setDroppableNodeRef}
      style={style}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        // only fire onClick event when click entry name or the most outside div
        if (
          e.target === e.currentTarget ||
          (e.target as HTMLDivElement).className.indexOf('outline-entry__name') !== -1
        ) {
          onClick();
        }
      }}
      className={cs('outline-entry', {
        'outline-entry--dragging': isDragging,
        'outline-entry--selected': isSelected,
      })}
    >
      <div
        className={cs('outline-entry-content', {
          'outline-entry-content--dragging': isDragging,
          'outline-entry-content--isOver': isOver,
        })}
      >
        {!isDragging && (
          <>
            <button
              {...attributes}
              {...listeners}
              ref={setDraggableNodeRef}
              className={cs('action', 'entry-handle')}
            >
              {handleSVG}
            </button>
            {collapsedStatus !== 'none' && (
              <button
                onClick={onCollapse}
                className={cs('collapse-icon', 'action', {
                  'collapse-icon--collapsed': collapsedStatus === 'collapsed',
                })}
              >
                {collapseIcon}
              </button>
            )}
            {renaming ? (
              <EntryNameInput
                name={name}
                onCancel={() => setRenaming(false)}
                onChange={(newName) => {
                  onNameChange(newName);
                  setRenaming(false);
                }}
              />
            ) : (
              <span onDoubleClick={() => setRenaming(true)} className="outline-entry__name">
                {name}
              </span>
            )}
            {!isSorting && !renaming && (
              <button onClick={onRemove} className="action action-remove">
                {removeSVG}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RenderEntry;
