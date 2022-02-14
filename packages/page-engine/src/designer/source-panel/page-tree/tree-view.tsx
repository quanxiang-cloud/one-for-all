import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { PageNode, useCtx } from '../../../index';
import DropIndicator, { DropIndicatorHandles } from './drop-indicator';
import type { DropResult, DragMoveProps } from './tree-node'
import TreeNode from './tree-node';
import { findNode } from 'src/utils/tree-utils';


export const COMPONENT_ICON_MAP: Record<string, string> = {
  page: 'insert_drive_file',
  image: 'photo_size_select_actual',
  text: 'text_fields',
  button: 'smart_button',
  grid: 'border_all',
  para: 'text_fields',
  link: 'link',
  textarea: 'text_fields',
  container: 'border_all',
  iframe: 'ballot',
  input: 'text_fields',
}

function TreeView(): JSX.Element {
  const { page } = useCtx();
  const {
    insertAfter,
    insertBefore,
    removeNode,
    appendNode,
    setDragPos,
    setActiveElemId,
  } = page;

  const dropIndicatorRef = useRef<DropIndicatorHandles>(null);

  function handleSelect(node: PageNode): void {
    page.setActiveElemId(node.id);
  }

  // 判断节点的父节点是否为布局容器类型（grid）
  function isLayoutContainerNode (node: PageNode): boolean {
    return findNode(page.schema.node, node.pid)?.exportName === 'grid'
  }

  function onDrop(item: PageNode, monitor: DropTargetMonitor): void {
    dropIndicatorRef.current?.clearIndicatorState();
    const dropResult = monitor.getDropResult();
    if (!dropResult) return;
    const { currentDragNode, targetDropNode, position, dropIndent } = monitor.getDropResult() as DropResult;

    if (!(currentDragNode && targetDropNode)) return;
    const { exportName: targetDropNodeExportName, children: targetNodeChildren } = targetDropNode;

    // 如果目标放置对象是容器 且 当前放置位置缩进小于3  或者 是布局容器内的容器， 则将源节点添加到目标节点的children中
    if (((targetDropNodeExportName === 'container' ) && dropIndent < 3) || isLayoutContainerNode(targetDropNode) || targetDropNodeExportName === 'page') {
      // 默认向容器内顶部添加孩子节点      
      if (targetNodeChildren?.length) {
        insertBefore(currentDragNode, targetNodeChildren[0]);
        return;
      }
      setDragPos('inner');
      appendNode(currentDragNode, targetDropNode);
      return;
    }

    if (position === 'before') {
      insertBefore(currentDragNode, targetDropNode);
      return;
    }
    insertAfter(currentDragNode, targetDropNode);
    return;
  }

  function canNodeDrop(currentDragNode: PageNode, targetDropNode: PageNode): boolean {
    const { id: currentDragNodeId, pid: currentDragNodePid } = currentDragNode;
    const { id: targetDropNodeId } = targetDropNode;
    
    // 如果 放置在自身或者 目标放置节点为源拖拽节点的后代节点，则不能放置
    if (currentDragNodeId === targetDropNodeId || findNode(currentDragNode, targetDropNode.id)) {
      return false
    };
    return true;
  }

  function onDragMove ({level, index, targetNode, dropIndent, canDrop}: DragMoveProps): void {    
    // 如果不能放置在目标节点处，清除拖拽指示器
    if(!canDrop){
      dropIndicatorRef.current?.clearIndicatorState();
      return;
    }
    
    // 如果垂直index刻度为0， 即放在根节点之前则不能放置， 清除拖拽指示器
    if(!Math.round(index)) {
      dropIndicatorRef.current?.clearIndicatorState();
      return;
    }

    // 拖放指示器位置整数刻度，
    // 如果为可放置到容器节点，则将精细位置刻度向上取整 
    // 如果放置类型为前后插入，则将精细位置刻度进行四舍五入
    const nodeIndex = (targetNode.children && dropIndent < 3) || isLayoutContainerNode(targetNode) ? Math.floor(index) :
        Math.round(index);

    // 指示器类型初始化，如果为容器节点且拖拽到了指定位置，则指示器类型变为 向内部添加到 方形框 否则视为 前后插入
    let indicatorType = targetNode.children && dropIndent < 3 ? 'over' : 'between';

    // 如果是 容器节点 且该节点容器的父节点属于网格布局容器（grid），则只能向 容器内添加节点，不能插入到之前或者之后
    if(targetNode.exportName === 'container' && isLayoutContainerNode(targetNode)){
      indicatorType = 'over'
    }

    // 不能通过大纲树拖拽改变网格布局容器的内容，只能在其整个节点之前或之后插入
    if(targetNode.exportName === 'grid') {
      indicatorType = 'between'
    }

    // 更新拖放指示器信
    dropIndicatorRef.current?.setIndicatorState({
      type: indicatorType,
      index: nodeIndex,
      depth: level,
    });
  }

  function canNodeDrag (dragNode: PageNode): boolean {
    if(!dragNode.pid || isLayoutContainerNode(dragNode)) return false
    return true;
  }

  function onNodeDelete (node: PageNode) {
    if (!page.activeElemId) {
      setActiveElemId(node.id); // if activeElemId empty, call removeNode will not update the view but data
    }
    removeNode(node.id);
  }

  const [, drop] = useDrop({
    accept: 'component_tree_node',
    drop: onDrop,
  });

  return (
    <div
      ref={drop}
      className="mt-8 tree-view relative"
      onMouseLeave={() => dropIndicatorRef.current?.clearIndicatorState()}
    >
      <DropIndicator ref={dropIndicatorRef} rowHeight={32} indent={16} />
      <TreeNode
        node={page.schema.node}
        level={0}
        onSelect={handleSelect}
        canNodeDrop={canNodeDrop}
        canNodeDrag={canNodeDrag}
        onDragMove={onDragMove}
        onDelete={onNodeDelete}
      />
    </div>
  );
}

export default observer(TreeView);