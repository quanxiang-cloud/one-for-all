import React, { useRef } from 'react';
import cs from 'classnames';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { observer } from 'mobx-react';

import { Icon, Tooltip } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { encode } from '../utils/base64';
import { elemId } from '../utils';

import styles from './index.m.scss';

interface Props {
  node: PageEngine.Node;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  preview?: boolean;
}

// node wrapper for each element in page
function Elem({ node, className, preview, children }: Props): JSX.Element {
  const { comp, id = elemId(node.comp), pid = '', label = '' } = node;
  const { page, registry, designer } = useCtx();
  const boxRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'elem',
    canDrag: comp !== 'page',
    item: {
      id,
      pid,
      comp,
      label: registry.getLabelByElemType(comp),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      if (targetNode?.comp) {
        console.log('[elem] dropped %o onto: %o', item, targetNode);
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
        comp,
        label: registry.getLabelByElemType(comp),
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

        let pos: PageEngine.DragPos = 'up';
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

  if (!preview) {
    drag(drop(boxRef));

    return (
      <>
        <DragPreviewImage connect={dragPreview} src={svgPreviewImg(label)} />
        <div
          className={cs(styles.elem, {
            [styles.isPage]: comp === 'page',
            [styles.dragging]: isDragging,
            [styles.isOver]: isOver,
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
            {comp.startsWith('elem.') && (
              <div className={cs('px-4 mr-6 bg-white mt-1', styles.group)}>
                <Tooltip position='top' label='复制'>
                  <span onClick={() => page.copyNode(pid, id)}>
                    <Icon name='content_copy' size={12} className='mr-8' clickable />
                  </span>
                </Tooltip>
                <Tooltip position='top' label='删除'>
                  <span onClick={() => page.removeNode(pid, id)}>
                    <Icon name='delete' size={14} clickable />
                  </span>
                </Tooltip>
              </div>
            )}
            <div className={cs('px-4 bg-blue-600', styles.group)}>
              <span onClick={() => {
              }} className='inline-flex items-center text-white'>
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

  return (
    <>
      {children}
    </>
  );
}

export default observer(Elem);
