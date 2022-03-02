import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrop, useDrag, XYCoord, DragPreviewImage } from 'react-dnd';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { toJS } from 'mobx';

import { Icon } from '@one-for-all/ui';
import { svgPreviewImg } from '../../../core/helpers';
import { PageNode, LoopNode, useCtx } from '../../../index';

export interface NodeItemProps {
  node: PageNode | LoopNode;
  level: number;
  canNodeDrop: (currentDragNode: PageNode, targetDropNode: PageNode) => boolean;
  canNodeDrag: (dragNode: PageNode) => boolean;
  onSelect?: (node: PageNode) => void;
  onDragMove?: (dragMoveData: DragMoveProps) => void
  onDragEnd?: (targetNode: PageNode, currentNode: PageNode) => void;
  nodeContentRender?: (node: PageNode) => React.ReactNode;
}

export type DropResult = {
  currentDragNode: PageNode;
  targetDropNode: PageNode;
  position: 'before' | 'after' | 'inner' | string;
  dropIndent: number;
}

export type DragMoveProps = {
  level: number;
  index: number;
  targetNode: PageNode;
  currentNode: PageNode;
  dropIndent: number;
  canDrop: boolean;
}

function TreeNode({
  node: rawNode, level, onSelect, onDragMove, onDragEnd, canNodeDrop, canNodeDrag, nodeContentRender
}: NodeItemProps): JSX.Element {
  const { page } = useCtx();
  const treeNodeRef = useRef<HTMLDivElement>(null);
  const isLoopNode = rawNode.type === 'loop-container';
  const node = (isLoopNode ? (rawNode as LoopNode).node : rawNode) as PageNode;
  const hasChild = node.children && node.children.length > 0;
  const [expand, setExpand] = useState(hasChild);

  useEffect(() => {
    if (node.children && node.children.length > 0) {
      setExpand(true);
      return;
    }
  }, [node.children?.length]);

  const [{ item, canDrop }, drop] = useDrop(() => ({
    accept: 'component_tree_node',
    drop: (item, monitor): DropResult | void => {
      const currentDragNode = item as PageNode;
      const targetDropNode = node;
      let insertPos = '';

      if (!canNodeDrop(currentDragNode, targetDropNode)) return;

      // 获取树最外层的位置信息
      const hoverBoundingRect = treeNodeRef.current?.parentElement?.getBoundingClientRect() as DOMRect;

      // 获取拖拽对象当前的位置信息
      const clientOffset = monitor.getClientOffset() as XYCoord;

      // 计算相对于树容器的水平距离
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // 记录拖拽对象的初始位置
      const initSourceClientOffset = monitor.getInitialSourceClientOffset() as XYCoord;

      // 计算拖拽时鼠标当前的缩进刻度
      const dropIndent = Math.floor(hoverClientX / 16) - level

      // 计算拖拽对象在垂直方向的余数，用于判断放置位置是在目标的前方还是后方
      const positionIndex = (initSourceClientOffset.y - clientOffset.y) % 32; // 32 is tree node height 32px

      // 计算放置的位置
      // 如果为0 （0无法参与计算）或者 满足一定条件
      // 拖拽的方向不同，positionIndex的判断 根据符号而改变
      // 0 无法参与判定计算，默认放置在前方 (positionIndex为 0 或 -0 时) 指针所在区域恰好是放置目标的前方
      // 如果从下往向上拖拽，positionIndex所得余数为正数，余数小于高度的一半的正数( positionIndex < 16)，则判定在放置目标的后方，否则判定在目标的前方
      // 如果从上往下拖拽， positionIndex所得余数为负数， 余数小于高度的一半负数( positionIndex < -16)，则判定在放置目标的后方，否则判定在目标的前方
      if (positionIndex === 0 || positionIndex > 16 * (positionIndex / Math.abs(positionIndex))) {
        insertPos = 'before';
      } else {
        insertPos = 'after';
      }

      // 返回给外层组件的drop hook，外层使用monitor.getDropResult() 进行获取数据
      return {
        currentDragNode,
        targetDropNode,
        position: insertPos,
        dropIndent: dropIndent,
      };
    },
    canDrop: (item) => canNodeDrop(item as PageNode, node),
    hover: (item, monitor) => {
      const didHover = monitor.isOver({ shallow: true });
      if (!didHover) return;
      const currentDragNode = item as PageNode;
      const targetDropNode = node;

      const hoverBoundingRect = treeNodeRef.current?.parentElement?.getBoundingClientRect() as DOMRect;

      const clientOffset = monitor.getClientOffset() as XYCoord;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      const dropIndent = Math.floor(hoverClientX / 16) - level

      // 计算拖拽时指针所在位置的刻度
      const dragIndicatorOffset = Math.abs(hoverClientY / 32);

      onDragMove?.({
        level,
        index: dragIndicatorOffset,
        targetNode: targetDropNode,
        currentNode: currentDragNode,
        dropIndent,
        canDrop: monitor.canDrop(),
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  }), [node]);

  const [, drag, dragPreview] = useDrag(() => ({
    type: 'component_tree_node',
    item: node,
    canDrag: () => canNodeDrag(node),
    end: (item) => onDragEnd?.(item as PageNode, node),
  }), [node]);


  const childrenRender: () => React.ReactNode = useCallback(() => {
    if (!node.children || !expand) return;
    return node.children?.map((child) => (
      <TreeNode
        key={child.id}
        node={child}
        level={level + 1}
        onSelect={onSelect}
        onDragMove={onDragMove}
        canNodeDrop={canNodeDrop}
        canNodeDrag={canNodeDrag}
        nodeContentRender={nodeContentRender}
      />
    ))
  }, [toJS(node)])

  drop(drag(treeNodeRef));

  function nodePrefixIconRender(): React.ReactNode {
    if (!node.children || !node.children?.length) return;
    return (
      <Icon
        size={16}
        clickable
        className="box-content flex-shrink-0"
        name={expand ? 'expand_more' : 'expand_less'}
        onClick={() => setExpand(!expand)}
        color="gray"
      />
    )
  }

  return (
    <>
      <DragPreviewImage connect={dragPreview} src={svgPreviewImg(node.label)} />
      <div
        ref={treeNodeRef}
        style={{ paddingLeft: (16 * level) }}
        key={node.id}
        className={cs('grid group hover:bg-gray-200 duration-100 flex-shrink-0 box-content', {
          'bg-gray-200': page.activeElemId === node.id,
          'opacity-30': !canDrop && item,
        })}
      >
        <div
          className={cs('flex items-center cursor-pointer pr-5 outline-draggable-tree-node')}
          onClick={() => {
            onSelect?.(node);
          }}
          onMouseOver={()=> page.setHoverNode(node.id)}
          onMouseLeave={()=> page.setHoverNode('')}
        >
          {nodePrefixIconRender()}
          {nodeContentRender ? nodeContentRender?.(node) : node.label}
        </div>
      </div>
      {childrenRender()}
    </>
  );
}

export default observer(TreeNode);
