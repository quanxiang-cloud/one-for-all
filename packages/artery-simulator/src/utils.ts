import { parentIdsSeq } from '@one-for-all/artery-utils';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { BehaviorSubject } from 'rxjs';
import { visibleElementsTickState } from './atoms';
import { Cursor, Position } from './types';
import { NodePrimary } from './types';

let n = 0;

export function useNextTick(): () => void {
  const next = useSetRecoilState(visibleElementsTickState);

  return () => {
    n = n + 1;
    next(n);
  };
}

const img = new Image();
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

export function overrideDragImage(dateTransfer: DataTransfer): void {
  dateTransfer.setDragImage(img, 0, 0);
}

interface GetPositionParam {
  cursor: Cursor;
  hoveringRect: DOMRectReadOnly;
  supportInner: boolean;
}

// TODO optimize this
export function calcHoverPosition({ cursor, hoveringRect, supportInner }: GetPositionParam): Position {
  const leftDistance = Math.abs(cursor.x - hoveringRect.left);
  const rightDistance = Math.abs(cursor.x - hoveringRect.right);
  if (!supportInner) {
    return leftDistance < rightDistance ? 'left' : 'right';
  }

  if (leftDistance <= 9) {
    return 'left';
  }

  if (rightDistance <= 9) {
    return 'right';
  }

  const oneThirdWidth = hoveringRect.width / 3;
  if (leftDistance < oneThirdWidth) {
    return 'inner-left';
  }

  if (rightDistance < oneThirdWidth) {
    return 'inner-right';
  }

  return 'inner';
}

const isNodeSupportChildrenCache: Map<string, boolean> = new Map();

export function cacheIsNodeSupportChildren(node: NodePrimary, isSupport: boolean): void {
  const cacheKey = getNodeExecutor(node);

  isNodeSupportChildrenCache.set(cacheKey, isSupport);
}

export function getIsNodeSupportChildrenFromCache(nodeExecutor: string): boolean | undefined {
  return isNodeSupportChildrenCache.get(nodeExecutor);
}

export function isChildNodeOf(
  root: Immutable.Collection<unknown, unknown>,
  parentID: string,
  childID: string,
): boolean {
  const parentIDs = parentIdsSeq(root, childID);
  if (!parentIDs) {
    return false;
  }

  return parentIDs.keyOf(parentID) !== undefined ? true : false;
}

export function getNodeExecutor(node: NodePrimary): string {
  if (node.type === 'html-element') {
    return `html-element:${node.name}`;
  }

  if (node.type === 'react-component') {
    return `react_component:${node.packageName}:${node.packageVersion}:${node.exportName}`;
  }

  return '';
}

export function useBehaviorSubjectState<T>(subject: BehaviorSubject<T>): T {
  const [state, setState] = useState(subject.value);

  useEffect(() => {
    const subscription = subject.subscribe(setState);
    return () => {
      subscription.unsubscribe();
    };
  }, [subject]);

  return state;
}
