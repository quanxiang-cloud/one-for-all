import { Rect } from '@one-for-all/elements-radar';
import React, { useEffect, useMemo, useState } from 'react';
import { audit, map, animationFrames } from 'rxjs';
import { getIsNodeSupportChildrenFromCache } from '../utils';
import { ContourNode, Position } from '../types';
import { cursor$ } from '../atoms';

interface Props {
  contour: ContourNode;
}

function calcPosition(X: number, isSupportChildren: boolean, rect: Rect): Position {
  if (!isSupportChildren) {
    return Math.abs(X - rect.x) > rect.width / 2 ? 'right' : 'left';
  }

  if (X < rect.x + 8) {
    return 'left';
  }

  if (X > rect.x + rect.width - 8) {
    return 'right';
  }

  return 'inner';
}

function calcStyle(position: Position, absolutePosition: Rect): React.CSSProperties | undefined {
  const { height, width, x, y } = absolutePosition;
  const _height = height - 4;
  const _y = y + 2;

  if (position === 'inner') {
    return {
      height: _height,
      width: width - 4,
      transform: `translate(${x + 2}px, ${_y}px)`,
    };
  }

  if (position === 'left') {
    return {
      height: _height,
      width: '8px',
      transform: `translate(${x - 9}px, ${_y}px)`,
    };
  }

  if (position === 'right') {
    return {
      height: _height,
      width: '8px',
      transform: `translate(${x + width + 2}px, ${_y}px)`,
    };
  }

  return;
}

export default function RenderGreenZoneForNodeWithoutChildren({ contour }: Props): JSX.Element {
  const [style, setStyle] = useState<React.CSSProperties>();
  const isSupportChildren = useMemo(() => {
    return !!getIsNodeSupportChildrenFromCache(contour.executor);
  }, [])

  useEffect(() => {
    const subscription = cursor$.pipe(
      audit(() => animationFrames()),
      map(({ x }) => calcPosition(x, isSupportChildren, contour.raw)),
      map((position) => calcStyle(position, contour.absolutePosition))
    ).subscribe(setStyle)

    return () => { subscription.unsubscribe(); }
  }, [])

  return (<div className="green-zone green-zone-for-node-without-children" style={style} />)
}
