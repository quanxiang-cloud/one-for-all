import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { toJS } from 'mobx';

import { PageSchema, useCtx } from '@ofa/page-engine';

import { ElementInfo } from '../types';
import NodeRender from './node-render';
import NodeToolbox from './node-toolbox';
import { loadDevEnvPageSchema } from './helpers';

import styles from './index.m.scss';

interface Props {
  schema?: PageSchema;
  className?: string;
  onSave?: () => void;
  onPreview?: () => void;
}

function Canvas({ schema, className }: Props): JSX.Element {
  const { page, registry, dataSource } = useCtx();
  const toolRef = useRef<any>();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      console.log('dropped %o onto canvas: ', item);
      page.appendNode(item, null, { renewId: true });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  useEffect(() => {
    loadDevEnvPageSchema();
    // sync schema prop with store state
    schema && page.setSchema(schema);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleGetElements();
      toolRef.current.computedPlace();
    }, 100);
  }, [toJS(page.schema.node)]);

  function handleGetElements(): void {
    const root = document.getElementById('all') as HTMLDivElement;
    const _rootChildren = Array.from(root.children || []);
    const elementMap: any = {};
    handleEle(_rootChildren, elementMap);
    page.setSchemaElements(elementMap);
  }

  function handleEle(elements: Element[], newElements: Record<string, ElementInfo>): void {
    elements.map((element: Element) => {
      const nodeKey = element.getAttribute('data-node-key');
      const _children = Array.from(element.children);
      if (nodeKey) {
        newElements[nodeKey] = {
          element,
          position: element.getBoundingClientRect(),
        };
      }
      if (_children.length > 0) {
        handleEle(_children, newElements);
      }
    });
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.stopPropagation();
    const { pageX, pageY } = e;
    const checkedNodeIds: string[] = [];
    const elementMap = toJS(page.schemaElements);
    Object.entries(elementMap).forEach((item) => {
      const [nodeKey, params] = item;
      const { position } = params;
      const { x, y, width, height } = position;
      if ((x < pageX && pageX < (x + width)) && (y < pageY && pageY < (y + height))) {
        if (nodeKey) {
          checkedNodeIds.push(nodeKey);
        }
      }
    });

    page.setParentNodes(checkedNodeIds);
    const currActiveId = checkedNodeIds[checkedNodeIds.length - 1];
    if (page.activeElemId === currActiveId) return;
    page.setActiveElemId(currActiveId);
  }

  return (
    <div className='relative bg-red' id="page-engine-canvas">
      <NodeToolbox ref={toolRef} />
      <div
        id='all'
        onClick={handleClick}
        className={cs(styles.page, className)}
        ref={drop}
      >
        <NodeRender schema={page.schema.node} />
      </div>
    </div>
  );
}

export default observer(Canvas);
