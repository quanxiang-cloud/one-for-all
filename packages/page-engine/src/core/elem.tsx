import React, { useRef } from 'react';
import cs from 'classnames';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { observer } from 'mobx-react';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { encode } from '../utils/base64';
import { elemId } from '../utils';
import type { PageNode, DragPos } from '@ofa/page-engine';

import styles from './index.m.scss';

interface Props {
  node: PageNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// node wrapper for each element in page
function Elem({ node, className, children }: Props): JSX.Element {
  const { exportName, id = elemId(node.exportName), pid = '', label = '' } = node;
  const { page, registry, designer } = useCtx();
  const boxRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'elem',
    canDrag: exportName !== 'page',
    item: {
      id,
      pid,
      exportName,
      label: registry.getLabelByElemType(exportName),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      if (targetNode?.exportName) {
        console.log('[elem] dropped %o onto: %o, pos: %s', item, targetNode, page.dragPos);
        page.appendNode(item, targetNode);
      }
    },
  }), [page.activeElemId, page.dragPos, page.schema]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['elem', 'source_elem'],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (item.id === id) {
        // drop on self, ignore
        return;
      }

      return {
        id,
        pid,
        exportName,
        label: registry.getLabelByElemType(exportName),
      };
    },
    hover: (item, monitor) => {
      const didHover = monitor.isOver({ shallow: true });
      if (didHover && item.id !== id) {
        const {
          top: hoverDOMTop,
          bottom: hoverDOMBottom,
          left: hoverDOMLeft,
          right: hoverDOMRight,
        }: any =
        boxRef.current && boxRef.current.getBoundingClientRect();

        const hoverMiddleY = (hoverDOMBottom - hoverDOMTop) / 2;
        const hoverMiddleX = (hoverDOMRight - hoverDOMLeft) / 2;

        const { x: dragOffsetX, y: dragOffsetY }: any = monitor.getSourceClientOffset();
        const hoverClientY = dragOffsetY - hoverDOMTop;
        const hoverClientX = dragOffsetX - hoverDOMLeft;

        let pos: DragPos = 'up';
        if (Math.abs(hoverClientY) <= hoverMiddleY / 2) {
          pos = 'inner';
        } else if (hoverClientY < 0 && Math.abs(hoverClientY) > hoverMiddleY / 2) {
          pos = 'up';
        } else if (hoverClientY > 0 && Math.abs(hoverClientY) > hoverMiddleY / 2) {
          pos = 'down';
        }
        page.setDragPos(pos);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      // canDrop: monitor.canDrop(),
    }),
  }), [page.activeElemId, page.dragPos, page.schema]);

  function svgPreviewImg(title: string): string {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'>
    <rect width='100' height='20' fill='#888' opacity='0.5'></rect>
    <text x='10' y='15' style='font-family: Roboto, sans-serif;font-size: 12px; fill: #000; text-align: center'>${title}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${encode(svg)}`;
  }

  drag(drop(boxRef));

  return (
    <>
      <DragPreviewImage connect={dragPreview} src={svgPreviewImg(label)} />
      <div
        className={cs(styles.elem, {
          [styles.isPage]: exportName === 'page',
          [styles.dragging]: isDragging,
          // [styles.isOver]: isOver,
          [styles.selected]: page.activeElemId === id,
          [styles.draggingUp]: isOver && page.dragPos === 'up',
          [styles.draggingInner]: isOver && page.dragPos === 'inner',
          [styles.draggingDown]: isOver && page.dragPos === 'down',
        }, className)}
        ref={boxRef}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          page.setActiveElemId(id);
          // check source panel open
          designer.checkPanel();
        }}
      >
        <div className={styles.toolbar}>
          {exportName !== 'page' && (
            <div className={cs('px-4 mr-6 bg-white mt-1', styles.group)}>
              <span onClick={() => page.copyNode(pid, id)}>
                <Icon name='content_copy' size={12} className='mr-8' clickable />
              </span>
              <span onClick={() => page.removeNode(id)}>
                <Icon name='delete' size={14} clickable />
              </span>
            </div>
          )}
          <div className={cs('px-4 bg-blue-600', styles.group)}>
            <span className='inline-flex items-center text-white'>
              <Icon name='insert_drive_file' color='white' size={12} className='mr-6' />
              <span>{label}</span>
            </span>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}

export default observer(Elem);
