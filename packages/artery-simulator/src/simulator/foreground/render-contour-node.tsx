import React from 'react';
import cs from 'classnames';
import { useRecoilState } from 'recoil';
import type { Node } from '@one-for-all/artery';

import useContourNodeStyle from './use-active-contour-node-style';
import type { ContourNode } from '../../types';
import {
  cursor$,
  draggingNodeIDState,
  hoveringContourNode$,
  hoveringParentIDState,
  inDnd$,
  onDropEvent$,
} from '../atoms';
import { overrideDragImage, useArteryRootNodeID, useBehaviorSubjectState } from '../utils';
import useShouldHandleDndCallback from './use-should-handle-dnd-callback';
import { DND_DATA_TRANSFER_TYPE_NODE_ID } from '../constants';
import { activeNode$, immutableRoot$, setActiveNode } from '../bridge';
import { byArbitrary, ImmutableNode } from '@one-for-all/artery-utils';

function preventDefault(e: any): false {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

interface Props {
  contourNode: ContourNode;
}

function RenderContourNode({ contourNode }: Props): JSX.Element {
  const [hoveringParentID] = useRecoilState(hoveringParentIDState);
  const rootNodeID = useArteryRootNodeID();
  const activeNode = useBehaviorSubjectState(activeNode$);
  const style = useContourNodeStyle(contourNode);
  const [draggingNodeID, setDraggingNodeID] = useRecoilState(draggingNodeIDState);
  const _shouldHandleDnd = useShouldHandleDndCallback(contourNode.id);

  return (
    <>
      <div
        id={`contour-${contourNode.id}`}
        style={style}
        // onClick={() => setActiveNode(contourNode.id)}
        onClick={() => {
          const keyPath = byArbitrary(immutableRoot$.value, contourNode.id);
          if (!keyPath) {
            return;
          }
          const n: ImmutableNode | undefined = immutableRoot$.value.getIn(keyPath) as ImmutableNode | undefined;
          if (!n) {
            return;
          }

          // @ts-ignore
          setActiveNode(n.toJS() as Node);
        }}
        draggable={contourNode.id !== rootNodeID}
        onDragStart={(e: React.DragEvent<HTMLDivElement>): any => {
          // todo this has no affect, fix it!
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData(DND_DATA_TRANSFER_TYPE_NODE_ID, contourNode.id);
          setDraggingNodeID(contourNode.id);

          overrideDragImage(e.dataTransfer);
        }}
        onDragEnd={() => {
          setDraggingNodeID(undefined);
          inDnd$.next(false);
        }}
        onDragOver={(e) => {
          if (!_shouldHandleDnd(e)) {
            return;
          }

          inDnd$.next(true);

          preventDefault(e);
          cursor$.next({ x: e.clientX, y: e.clientY });
        }}
        onDrag={(e) => {
          preventDefault(e);
          inDnd$.next(true);
        }}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>): any => {
          if (!_shouldHandleDnd(e)) {
            return;
          }

          hoveringContourNode$.next(contourNode);

          preventDefault(e);
          return false;
        }}
        onDragLeave={() => {
          // hoveringContourNode$.next(undefined);
          inDnd$.next(false);
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>): any => {
          preventDefault(e);
          onDropEvent$.next(e);

          inDnd$.next(false);

          return false;
        }}
        className={cs('contour-node', {
          'contour-node--root': rootNodeID === contourNode.id,
          'contour-node--active': activeNode?.id === contourNode.id,
          'contour-node--hover-as-parent': hoveringParentID === contourNode.id,
          'contour-node--dragging': draggingNodeID === contourNode.id,
        })}
      />
    </>
  );
}

export default RenderContourNode;