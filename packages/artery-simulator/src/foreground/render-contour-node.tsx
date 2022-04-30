import React, { useCallback, useContext, useRef } from 'react';
import cs from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';

import useContourNodeStyle from './use-active-contour-node-style';
import { ArteryCtx } from '../contexts';
import type { ContourNode } from '../types';
import { draggingNodeIDState, greenZoneState, hoveringContourNode$, hoveringParentIDState, immutableNodeState } from '../atoms';
import { isChildNodeOf, overrideDragImage } from '../utils';
import Toolbar from './toolbar';
import useSetActiveNode from './use-set-active-node';

function preventDefault(e: any): false {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

interface Props {
  contourNode: ContourNode;
}

function useShouldHandleDndCallback(currentID: string): () => boolean {
  const shouldHandleRef = useRef<boolean | undefined>();
  const [root] = useRecoilState(immutableNodeState);
  const [draggingNodeID] = useRecoilState(draggingNodeIDState);

  return useCallback(() => {
    if (!draggingNodeID) {
      return false;
    }

    if (shouldHandleRef.current === undefined) {
      shouldHandleRef.current = isChildNodeOf(root, currentID, draggingNodeID);
    }

    return shouldHandleRef.current;
  }, [draggingNodeID, root]);
}

function RenderContourNode({ contourNode }: Props): JSX.Element {
  const [hoveringParentID] = useRecoilState(hoveringParentIDState);
  const { rootNodeID, activeNode } = useContext(ArteryCtx);
  const style = useContourNodeStyle(contourNode);
  const setGreenZone = useSetRecoilState(greenZoneState);
  const [draggingNodeID, setDraggingNodeID] = useRecoilState(draggingNodeIDState);
  const couldFireDragOver = useRef<boolean>(true);
  const setActiveNode = useSetActiveNode();

  const _shouldHandleDnd = useShouldHandleDndCallback(contourNode.id);

  return (
    <>
      <div
        id={`contour-${contourNode.id}`}
        style={style}
        onClick={() => setActiveNode(contourNode.id)}
        draggable={contourNode.id !== rootNodeID}
        onDragStart={(e: React.DragEvent<HTMLDivElement>): any => {
          // todo this has no affect, fix it!
          e.dataTransfer.effectAllowed = 'move';
          setDraggingNodeID(contourNode.id);

          overrideDragImage(e.dataTransfer);
        }}
        onDragEnd={() => {
          setDraggingNodeID(undefined);
          setGreenZone(undefined);
        }}
        onDrag={preventDefault}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>): any => {
          if (!_shouldHandleDnd()) {
            return;
          }

          hoveringContourNode$.next(contourNode);

          preventDefault(e);
          return false;
        }}
        onDragLeave={() => { couldFireDragOver.current = true }}
        onDrop={(e: React.DragEvent<HTMLDivElement>): any => {
          e.stopPropagation();
          e.preventDefault();
          console.log('todo, handle drop event')
          // handleDrop(e);
          return false;
        }}
        className={cs('contour-node', {
          'contour-node--root': rootNodeID === contourNode.id,
          'contour-node--active': activeNode?.id === contourNode.id,
          'contour-node--hover-as-parent': hoveringParentID === contourNode.id,
          'contour-node--dragging': draggingNodeID === contourNode.id,
        })}
      />
      {activeNode?.id === contourNode.id && (
        <Toolbar contourNode={contourNode} />
      )}
    </>
  );
}

export default RenderContourNode;
