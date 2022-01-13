import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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

  useLayoutEffect(() => {
    // get all elems on page
    const root = document.querySelector('.pge-canvas') as HTMLDivElement;
    const _rootChildren = Array.from(root.children || []);
    const elementMap: any = {};
    handleEle(_rootChildren, elementMap);
    page.setSchemaElements(elementMap);

    toolRef.current.computedPlace();
  }, [toJS(page.schema.node)]);

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
    e.stopPropagation(); // Onclick event of inner element
    e.preventDefault(); // Default behavior of the link component

    // const { pageX, pageY } = e;
    // const checkedNodeIds: string[] = [];
    // const elementMap = toJS(page.schemaElements);
    // Object.entries(elementMap).forEach(([nodeKey, { position }]) => {
    //   const { x, y, width, height } = position;
    //   if ((x < pageX && pageX < (x + width)) && (y < pageY && pageY < (y + height))) {
    //     if (nodeKey) {
    //       checkedNodeIds.push(nodeKey);
    //     }
    //   }
    // });
    //
    // page.setParentNodes(checkedNodeIds);
    // const currActiveId = checkedNodeIds[checkedNodeIds.length - 1];
    // if (page.activeElemId === currActiveId) return;

    // get event target's closest parent with attribute data-node-key
    // because some elem may has children, like container
    const elemId = (e.target as Element)?.closest('[data-node-key]')?.getAttribute('data-node-key') || '';
    elemId && page.setActiveElemId(elemId);
  }

  return (
    <div
      className={cs('relative pge-canvas', styles.page, className)}
      onClick={handleClick}
      ref={drop}
    >
      <NodeRender schema={page.schema.node} />
      <NodeToolbox ref={toolRef} />
    </div>
  );
}

export default observer(Canvas);
