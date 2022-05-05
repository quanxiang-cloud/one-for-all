import { Rect } from '@one-for-all/elements-radar';
import React, { useEffect, useMemo, useState } from 'react';
import { audit, map, animationFrames, tap } from 'rxjs';
import { getIsNodeSupportChildrenFromCache } from '../utils';
import { GreenZoneForNodeWithoutChildren, Position } from '../types';
import { cursor$, latestFocusedGreenZone$ } from '../atoms';

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

export default function RenderGreenZoneForNodeWithoutChildren({ greenZone }: Props): JSX.Element {
  const [style, setStyle] = useState<React.CSSProperties>();
  const isSupportChildren = useMemo(() => {
    return !!getIsNodeSupportChildrenFromCache(greenZone.contour.executor);
  }, []);

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
  }, []);

  return <div className="green-zone green-zone-for-node-without-children" style={style} />;
}
