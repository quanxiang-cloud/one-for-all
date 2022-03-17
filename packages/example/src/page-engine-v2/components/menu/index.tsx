import React, { useCallback, DragEventHandler } from 'react';

import { lensPath, set } from 'ramda';
import { BlockItemProps, SchemaComponent, uuid } from '@one-for-all/page-engine-v2';

import { BlocksCommunicationType } from '../../types';
import components from './components';
import Outline from './outline';

import './style.scss';

export default function Menu({ schema, onChange, blocksCommunicationState$ }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const updateSchema = useCallback((): void => {
    const lens = lensPath(['node', 'name']);
    const newSchema = set(lens, 'test', schema);
    onChange(newSchema);
  }, [schema, onChange]);

  function onDragStart(component: SchemaComponent): DragEventHandler<HTMLDivElement> {
    return () => {
      blocksCommunicationState$.next({
        ...blocksCommunicationState$.value,
        componentToAdd: {...component, id: uuid()},
      })
    }
  }

  return (
    <div className="page-engine-layer-block__menu">
      <div className="page-engine-layer-block__menu-components">
        {components.map((component, index) => {
          const { name, Preview } = component;
          if (!Preview) {
            return null
          }
          return (
            <div key={index} className="page-engine-layer-block__menu-components-item" draggable onDragStart={onDragStart(component)}>
              <span className="page-engine-layer-block__menu-components-item__name" onClick={updateSchema}>{name}</span>
              <div className="page-engine-layer-block__menu-components-item__component">
                <Preview />
              </div>
            </div>
          )
        })}
      </div>
      <Outline node={schema.node} blocksCommunicationState$={blocksCommunicationState$} />
    </div>
  )
}
