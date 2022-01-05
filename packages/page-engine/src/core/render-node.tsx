import React, { useRef } from 'react';
// import cs from 'classnames';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';
import { defaults, flow } from 'lodash';
import { toJS } from 'mobx';

import { PageNode, useCtx } from '@ofa/page-engine';
import { NodeType } from '@ofa/render-engine';

import { mapRawProps } from '../utils/schema-adapter';
import { elemId } from '../utils';
import { encode } from '../utils/base64';

// import styles from './index.m.scss';

interface Props {
  schema: PageNode,
}

const identity = (x: any): any => x;

function RenderNode({ schema }: Props): JSX.Element {
  const { exportName, id = elemId(schema.exportName), pid = '', label = '' } = schema;
  const { page, registry, dataSource } = useCtx();
  const boxRef = useRef<any>(null);

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
        // console.log('[elem] dropped %o onto: %o', item, targetNode);
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

  function mergeProps(schema: PageNode): Record<string, any> {
    const elemConf = registry.getElemByType(schema.exportName) || {};
    const toProps = elemConf?.toProps || identity;
    const elemProps = defaults({}, mapRawProps(schema.props || {}), elemConf?.defaultConfig);

    // console.log({ ref: boxRef });

    return Object.assign(toProps(elemProps), {
      'data-node-key': schema.id,
      ref: boxRef,
      // className: cs({
      //   [styles.isPage]: exportName === 'page',
      //   [styles.dragging]: isDragging,
      //   // [styles.isOver]: isOver,
      //   [styles.selected]: page.activeElemId === id,
      //   [styles.draggingUp]: isOver && page.dragPos === 'up',
      //   [styles.draggingInner]: isOver && page.dragPos === 'inner',
      //   [styles.draggingDown]: isOver && page.dragPos === 'down',
      // }),
      // draggable: true,
    });
  }

  const schemaToProps = flow([
    // mergeStyle,
    mergeProps,
  ]);

  function transformType(schema: PageNode): string | React.ComponentType {
    const { type } = schema;
    if (type === NodeType.ReactComponentNode) {
      return registry.elementMap?.[schema.exportName]?.component || type;
    }
    // if (type === NodeType.HTMLNode) {
    //   return schema.name || 'div';
    // }

    return 'div';
  }

  return (
    <>
      <DragPreviewImage connect={dragPreview} src={svgPreviewImg(label)} />
      {
        React.createElement(
          transformType(schema),
          schemaToProps(toJS(schema)),
          ...([].concat(schema.children as any))
            .map((child, index) => <RenderNode key={schema.id + index} schema={child} />))
      }
    </>
  );
}

export default RenderNode;
