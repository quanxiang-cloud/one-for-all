import React, { useCallback, useContext, useMemo, useRef } from 'react';
import cs from 'classnames';
import { Node } from '@one-for-all/artery';
import { byArbitrary } from '@one-for-all/artery-utils';
import { useRecoilState, useSetRecoilState } from 'recoil';

import useContourNodeStyle from './use-active-contour-node-style';
import { ArteryCtx } from '../contexts';
import type { ContourNode } from '../types';
import { draggingNodeIDState, greenZoneState, hoveringParentIDState, immutableNodeState } from '../atoms';
import { isChildNodeOf, overrideDragImage } from '../utils';
import Toolbar from './toolbar';

function preventDefault(e: any): false {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

interface Props {
  contourNode: ContourNode;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
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

function RenderContourNode({ contourNode, handleDragOver, handleDrop }: Props): JSX.Element {
  const [hoveringParentID] = useRecoilState(hoveringParentIDState);
  const { rootNodeID, activeNode, setActiveNode } = useContext(ArteryCtx);
  const style = useContourNodeStyle(contourNode);
  const setGreenZone = useSetRecoilState(greenZoneState);
  const [draggingNodeID, setDraggingNodeID] = useRecoilState(draggingNodeIDState);
  const [immutableNode] = useRecoilState(immutableNodeState);
  const couldFireDragOver = useRef<boolean>(true);
  // todo optimize this
  const currentArteryNode: Node | undefined = useMemo(() => {
    const keyPath = byArbitrary(immutableNode, contourNode.id);
    if (!keyPath) {
      return;
    }
    // @ts-ignore
    return immutableNode.getIn(keyPath)?.toJS();
  }, [immutableNode]);

  const _shouldHandleDnd = useShouldHandleDndCallback(contourNode.id);

  return (
    <>
      <div
        id={`contour-${contourNode.id}`}
        style={style}
        onClick={() => setActiveNode(currentArteryNode)}
        draggable={contourNode.id !== rootNodeID}
        onDragStart={(e: React.DragEvent<HTMLDivElement>): any => {
          // todo this has no affect, fix it!
          e.dataTransfer.effectAllowed = 'move';
          setDraggingNodeID(currentArteryNode?.id);

          overrideDragImage(e.dataTransfer);
        }}
        onDragEnd={() => {
          setDraggingNodeID(undefined);
          setGreenZone(undefined);
        }}
        onDrag={preventDefault}
        onDragOver={(e: React.DragEvent<HTMLDivElement>): any => {
          if (!_shouldHandleDnd()) {
            return;
          }

          preventDefault(e);
          if (couldFireDragOver.current) {
            handleDragOver(e);
            couldFireDragOver.current = false;
          }
          return false;
        }}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>): any => {
          if (!_shouldHandleDnd()) {
            return;
          }

          preventDefault(e);
          return false;
        }}
        onDragLeave={() => { couldFireDragOver.current = true }}
        onDrop={(e: React.DragEvent<HTMLDivElement>): any => {
          e.stopPropagation();
          e.preventDefault();
          handleDrop(e);
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
