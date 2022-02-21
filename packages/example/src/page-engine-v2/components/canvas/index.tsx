import React, { useState, useEffect, MouseEvent, DragEvent } from 'react';
import { lensPath, over } from 'ramda';
import PageEngine2, { BlockItemProps, loadComponentsFromSchema, SchemaComponent } from '@one-for-all/page-engine-v2';

import { BlocksCommunicationType } from '../../types';

import './style.scss';

export default function Canvas({ schema, blocksCommunicationState$, onChange }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [components, setComponents] = useState<SchemaComponent[]>([]);
  const state = PageEngine2.useObservable(blocksCommunicationState$, { activeNodeID: '' });

  useEffect(() => {
    loadComponentsFromSchema(schema).then(setComponents)
  }, [schema]);

  function handleNodeClick(id: string) {
    return (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      blocksCommunicationState$.next({
        ...blocksCommunicationState$.value,
        activeNodeID: id,
      })
    }
  }

  function onDragEnter(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.dropEffect = 'move';
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.dropEffect = 'none';
  }

  function onDrop() {
    const { componentToAdd } = blocksCommunicationState$.value;
    if (componentToAdd) {
      const { id, name } = componentToAdd;
      const newNode = { type: 'react-component', id, packageName: '@one-for-all/example', packageVersion: '0.0.1', exportName: name };
      const schemaChildrenPath = lensPath(['node', 'children']);
      onChange(over(schemaChildrenPath, (children) => [...children, newNode], schema));
    }
  }

  return (
    <div className="page-engine-layer-block__canvas">
      <div className="page-engine-layer-block__canvas-toolbar">toolbar</div>
      <div className="page-engine-layer-block__canvas-container">
        {components.map(({ Render, id }) => {
          return (
            <div
              key={id}
              onClick={handleNodeClick(id)}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={state.activeNodeID === id ? { outline: '1px solid red' } : {}}
            >
              <Render />
            </div>
          )
        })}
      </div>
    </div>
  )
}
