import React from 'react';

import { draggingNodeIDState, greenZonesBetweenNodesState } from './atoms';
import { useRecoilState } from 'recoil';

function RenderGreenZonesBetweenNodes(): JSX.Element | null {
  const [greenZonesBetweenNodes] = useRecoilState(greenZonesBetweenNodesState);
  const [draggingNodeID] = useRecoilState(draggingNodeIDState);

  if (!draggingNodeID || !greenZonesBetweenNodes.length) {
    return null;
  }

  // `contour-green-zone--${greenZone.position}`
  return (
    <>
      {greenZonesBetweenNodes.map(({ left, right, absolutePosition }) => {
        return (
          <div
            key={`${left.id}-${right.id}`}
            className="green-zone-position-indicator"
            style={{
              height: absolutePosition.height,
              width: absolutePosition.width,
              transform: `translate(${absolutePosition.x}px, ${absolutePosition.y}px)`,
            }}
          />
        )
      })}
    </>
  );
}

export default RenderGreenZonesBetweenNodes;
