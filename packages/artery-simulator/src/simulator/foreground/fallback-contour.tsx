import React, { useEffect, useState } from 'react';
import cs from 'classnames';

import { FALLBACK_CONTOUR, FALLBACK_CONTOUR_NODE_ID } from '../constants';
import {
  cursor$,
  hoveringContourNode$,
  inDnd$,
  latestFocusedGreenZone$,
  onDropEvent$,
} from '../states-center';

function preventDefault(e: any): false {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

const fallbackContourStyle: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  position: 'fixed',
}

function FallbackContourNode(): JSX.Element {
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    if (!hovering) {
      return;
    }

    latestFocusedGreenZone$.next({ type: 'fallback-contour-green-zone' });
  }, [hovering])

  return (
    <>
      <div
        id={FALLBACK_CONTOUR_NODE_ID}
        style={fallbackContourStyle}
        className={cs('contour-node', {
          'green-zone-between-nodes--focused': hovering,
          'green-zone-between-nodes': hovering,
        })}
        onDragOver={(e) => {
          preventDefault(e);
          inDnd$.next(true);

          preventDefault(e);
          cursor$.next({ x: e.clientX, y: e.clientY });
        }}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>): any => {
          preventDefault(e);
          setHovering(true);
          hoveringContourNode$.next(FALLBACK_CONTOUR);

          preventDefault(e);
          return false;
        }}
        onDragLeave={() => {
          setHovering(false);
          inDnd$.next(false);
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>): any => {
          preventDefault(e);
          onDropEvent$.next(e);

          inDnd$.next(false);
          setHovering(false);

          return false;
        }}
      />
    </>
  );
}

export default FallbackContourNode;
