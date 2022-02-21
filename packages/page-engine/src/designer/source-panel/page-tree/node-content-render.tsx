
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';

import { Icon } from '@one-for-all/ui';

import { PageNode, useCtx } from '../../../index';
import { COMPONENT_ICON_MAP } from './tree-view';

export function nodeContentRender(node: PageNode): React.ReactNode {
  const { page } = useCtx();
  const { removeNode, setActiveElemId, isLayoutContainerNode } = page;
  const [isModdingName, setIsModdingName] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>(node.label);
  const renameInputRef = useRef<HTMLInputElement>(null);

  function onNodeDelete(node: PageNode) {
    if (!page.activeElemId) {
      setActiveElemId(node.id); // if activeElemId empty, call removeNode will not update the view but data
    }
    removeNode(node.id);
  }

  useEffect(() => {
    if (!isModdingName) return;
    renameInputRef.current?.focus();
  }, [isModdingName])

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setNodeName(e.target.value.trim())
  }

  function onModifiedNodeName() {
    setIsModdingName(false)
    if (!nodeName) return;
    page.updateElemProperty(node.id, 'label', nodeName)
  }

  return (<div className='h-full group flex items-center flex-1 flex-shrink-0 '>
    <Icon
      size={16}
      clickable
      color="gray"
      name={COMPONENT_ICON_MAP[node.exportName]}
      className="flex-shrink-0 box-content"
    />
    <div className='h-full flex flex-1 items-center pl-4 justify-between'>
      {
        isModdingName ? (
          <input
            type="text"
            className="w-80 p-4"
            ref={renameInputRef}
            value={nodeName}
            onBlur={onModifiedNodeName}
            onChange={onInputChange}
          />
        ) : (
          <>
            <div className='w-100 truncate'>{node.label}</div>
            <Icon
              clickable
              size={18}
              color="gray"
              name="mode_edit"
              className="opacity-0 group-hover:opacity-100 ml-10 flex-shrink-0 box-content"
              onClick={(e) => {
                e.stopPropagation();
                setIsModdingName((prevState) => !prevState)
              }}
            />
          </>)
      }
    </div>
    {
      !isLayoutContainerNode(node) && node.exportName !== 'page' && (
        <Icon
          clickable
          size={18}
          color="gray"
          name="delete"
          className="opacity-0 group-hover:opacity-100 ml-10 flex-shrink-0 box-content"
          onClick={(e) => {
            e.stopPropagation();
            onNodeDelete(node);
          }}
        />
      )
    }
  </div>)
}
