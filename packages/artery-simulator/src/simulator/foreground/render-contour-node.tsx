import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import type { Node } from '@one-for-all/artery';
import { byArbitrary, ImmutableNode } from '@one-for-all/artery-utils';
import { distinctUntilChanged, map } from 'rxjs';

import useContourNodeStyle from './use-active-contour-node-style';
import type { ContourNode } from '../../types';
import {
  cursor$,
  draggingNodeID$,
  hoveringContourNode$,
  hoveringParentID$,
  inDnd$,
  onDropEvent$,
  activeContour$,
  immutableRoot$,
  useArteryRootNodeID,
} from '../states-center';
import { overrideDragImage, useBehaviorSubjectState } from '../utils';
import useShouldHandleDndCallback from './use-should-handle-dnd-callback';
import { DND_DATA_TRANSFER_TYPE_NODE_ID } from '../constants';
import { setActiveNode } from '../bridge';

function preventDefault(e: any): false {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

interface Props {
  contourNode: ContourNode;
}

function useWhetherActive(currentID: string): boolean {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const subscription = activeContour$
      .pipe(
        map((activeContour) => activeContour?.id === currentID),
        distinctUntilChanged(),
      )
      .subscribe(setFlag);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return flag;
}

function RenderContourNode({ contourNode }: Props): JSX.Element {
  const hoveringParentID = useBehaviorSubjectState(hoveringParentID$);
  const rootNodeID = useArteryRootNodeID();
  const style = useContourNodeStyle(contourNode);
  const _shouldHandleDnd = useShouldHandleDndCallback(contourNode.id);
  const currentActive = useWhetherActive(contourNode.id);
  const [isDragging, setIsDragging] = useState(false);

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
          const n: ImmutableNode | undefined = immutableRoot$.value.getIn(keyPath) as
            | ImmutableNode
            | undefined;
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
          draggingNodeID$.next(contourNode.id);
          setIsDragging(true);

          overrideDragImage(e.dataTransfer);
        }}
        onDragEnd={() => {
          draggingNodeID$.next('');
          setIsDragging(false);
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
          'contour-node--active': currentActive,
          'contour-node--hover-as-parent': hoveringParentID === contourNode.id,
          'contour-node--dragging': isDragging,
        })}
      />
    </>
  );
}

export default RenderContourNode;
