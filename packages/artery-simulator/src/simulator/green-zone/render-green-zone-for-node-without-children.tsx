import React, { useEffect, useState } from 'react';
import { Rect } from '@one-for-all/elements-radar';
import { audit, map, animationFrames, tap } from 'rxjs';

import { _checkIfNodeSupportChildren, isNodeSupportChildrenCache } from '../cache';
import { GreenZoneForNodeWithoutChildren, Position } from '../../types';
import { cursor$, latestFocusedGreenZone$ } from '../states-center';

interface Props {
  greenZone: GreenZoneForNodeWithoutChildren;
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
      transform: `translate(${Math.max(x - 9, 0)}px, ${_y}px)`,
    };
  }

  if (position === 'right') {
    return {
      height: _height,
      width: '8px',
      // todo read innerWidth has performance cost, optimize it
      transform: `translate(${Math.min(x + width + 2, window.innerWidth - 9)}px, ${_y}px)`,
    };
  }

  return;
}

export default function RenderGreenZoneForNodeWithoutChildren({ greenZone }: Props): JSX.Element {
  const [style, setStyle] = useState<React.CSSProperties>();
  const isSupportChildren = !!isNodeSupportChildrenCache.get(greenZone.contour.executor);

  useEffect(() => {
    const subscription = cursor$
      .pipe(
        audit(() => animationFrames()),
        map(({ x }) => calcPosition(x, isSupportChildren, greenZone.contour.raw)),
        tap((position) =>
          latestFocusedGreenZone$.next({
            position,
            contour: greenZone.contour,
            type: 'node_without_children',
          }),
        ),
        map((position) => calcStyle(position, greenZone.contour.absolutePosition)),
      )
      .subscribe(setStyle);

    return () => {
      subscription.unsubscribe();
    };
  }, [greenZone]);

  return <div className="green-zone green-zone-for-node-without-children" style={style} />;
}
