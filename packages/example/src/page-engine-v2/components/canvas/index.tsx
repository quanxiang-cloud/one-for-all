import React, { useState, useEffect, MouseEvent, DragEvent } from 'react';
import { lensPath, over } from 'ramda';
import PageEngine2, { BlockItemProps, loadComponentsFromSchema, SchemaComponent, useCanvasCommand } from '@one-for-all/page-engine-v2';

import { BlocksCommunicationType } from '../../types';

import './style.scss';

interface Button {
  label: string;
  icon: string;
  tip?: string;
  handler: () => void;
}

export default function Canvas({ schema, blocksCommunicationState$, onChange, setLayer }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [components, setComponents] = useState<SchemaComponent[]>([]);
  const state = PageEngine2.useObservable(blocksCommunicationState$, { activeNodeID: '' });
  const [preview, setPreview] = useState(false);
  const [edit, setEdit] = useState(false);
  const { commands, registry, useInit } = useCanvasCommand({ schema, onChange, blocksCommunicationState$ });
  registry({
    name: 'preview',
    keyboard: ['ctrl+p'],
    execute() {
      const { activeNodeID } = state;
      if (!activeNodeID) {
        return {};
      }
      return {
        redo() {
          blocksCommunicationState$.next({
            ...blocksCommunicationState$.value,
            activeNodeID: '',
          })
          setPreview(true);
        },
        undo() {
          blocksCommunicationState$.next({
            ...blocksCommunicationState$.value,
            activeNodeID,
          })
          setPreview(false);
        }
      }
    }
  })
  useInit();

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
    if (componentToAdd && componentToAdd.name && componentToAdd.label) {
      const { id, name, label } = componentToAdd;
      const newNode = { type: 'react-component', id, packageName: '@one-for-all/example', packageVersion: '0.0.1', exportName: name, label };
      const schemaChildrenPath = lensPath(['node', 'children']);
      onChange(over(schemaChildrenPath, (children) => [...children, newNode], schema));
    }
  }

  function onClick() {
    setLayer(layer => {
      return {
        ...layer,
        blocks: layer.blocks.map(block => {
          const { render } = block;
          const name = render.name;
          if (name === 'Header') {
            return {
              ...block,
              visible: !block.visible,
            }
          }
          return block;
        })
      }
    })
  }

  const buttons: Button[] = [{
    label: '撤销',
    icon: 'cancel',
    handler: commands.undo,
    tip: 'ctrl+z'
  }, {
    label: '重做',
    icon: 'cancel',
    handler: commands.redo,
    tip: 'ctrl+y, ctrl+shift+z',
  }, {
    label: preview ? '编辑' : '预览',
    icon: preview ? 'cancel' : 'cancel',
    handler: commands.preview,
  }, {
    label: '删除',
    icon: 'cancel',
    handler: commands.delete,
    tip: 'ctrl+d, backspace, delete'
  }, {
    label: '清空',
    icon: 'cancel',
    handler: commands.clear,
  }];

  return (
    <div className="page-engine-layer-block__canvas">
      <div className="page-engine-layer-block__canvas-toolbar">
        <div>toolbar</div>
        <button onClick={onClick}>点我触发隐藏或显示header</button>
        <div style={{marginTop: 10}}>
          {buttons.map(({ label, icon, tip, handler }) => (
            <button key={label} onClick={handler} title={tip} style={{marginRight: 10, cursor: 'pointer'}}>
              <span>x</span>{label}
            </button>
          ))}
        </div>
      </div>
      <div className="page-engine-layer-block__canvas-container">
        {components.map(({ Render, id }) => {
          if (!Render) {
            return null;
          }
          return (
            <div
              key={id}
              onClick={handleNodeClick(id)}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={state.activeNodeID === id ? 'page-engine-layer-block__canvas-container-item page-engine-layer-block__canvas-container-item--active' : 'page-engine-layer-block__canvas-container-item'}
            >
              <Render />
            </div>
          )
        })}
      </div>
    </div>
  )
}
