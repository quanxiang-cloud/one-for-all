import { Rect } from '@one-for-all/elements-radar';
import React, { useEffect, useState } from 'react';
import { map, distinctUntilChanged, audit, tap } from 'rxjs/operators';
import { animationFrames } from 'rxjs';
import { cursor$, latestFocusedGreenZone$ } from '../atoms';
import { Cursor, GreenZoneInsideNode } from '../types';
import cs from 'classnames';

interface Props {
  greenZones: GreenZoneInsideNode[];
}

function isInside(cursor: Cursor, raw: Rect): boolean {
  return (
    cursor.x >= raw.x && cursor.x <= raw.x + raw.width && cursor.y >= raw.y && cursor.y <= raw.y + raw.height
  );
}

function getGreenZoneID(greenZone: GreenZoneInsideNode): string {
  if (greenZone.type === 'adjacent-with-parent') {
    return `adjacent-${greenZone.parent.id}-${greenZone.child.id}-${greenZone.edge}`;
  }

  return `between-${greenZone.left.id}-${greenZone.right.id}`;
}

function useInsideID(greenZones: GreenZoneInsideNode[]): string {
  const [inSideID, setInsideID] = useState<string>('');

  useEffect(() => {
    const subscription = cursor$
      .pipe(
        audit(() => animationFrames()),
        map((cursor) => greenZones.filter(({ raw }) => isInside(cursor, raw))),
        map((greenZones) => (greenZones.length ? greenZones[0] : undefined)),
        tap((greenZone) => latestFocusedGreenZone$.next(greenZone)),
        map((greenZone) => {
          if (!greenZone) {
            return '';
          }

          return getGreenZoneID(greenZone);
        }),
        distinctUntilChanged(),
      )
      .subscribe(setInsideID);

    return () => {
      subscription.unsubscribe();
    };
  }, [greenZones]);

  return inSideID;
}

export default function RenderGreenZonesBetweenNodes({ greenZones }: Props): JSX.Element | null {
  const insideID = useInsideID(greenZones);

  return (
    <>
      {greenZones.map((greenZone) => {
        const key = getGreenZoneID(greenZone);
        if (greenZone.type === 'between-nodes') {
          const { absolutePosition } = greenZone;
          return (
            <div
              key={key}
              className={cs('green-zone green-zone-between-nodes', {
                'green-zone-between-nodes--focused': key === insideID,
              })}
              style={{
                height: absolutePosition.height,
                width: absolutePosition.width,
                transform: `translate(${absolutePosition.x}px, ${absolutePosition.y}px)`,
              }}
            />
          );
        }

        return (
          <div
            key={key}
            className={cs('green-zone green-zone-between-nodes', {
              'green-zone-between-nodes--focused': key === insideID,
            })}
            style={{
              height: greenZone.absolutePosition.height,
              width: greenZone.absolutePosition.width,
              transform: `translate(${greenZone.absolutePosition.x}px, ${greenZone.absolutePosition.y}px)`,
            }}
          />
        );
      })}
    </>
  );
}
