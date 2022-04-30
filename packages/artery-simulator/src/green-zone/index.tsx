import React from 'react';

import { draggingNodeIDState, immutableNodeState } from '../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import useGreenZonesBetweenNodes from './use-green-zones-between-nodes';

function GreenZone(): JSX.Element | null {
  const rootNode = useRecoilValue(immutableNodeState)
  const greenZonesBetweenNodes = useGreenZonesBetweenNodes(rootNode);
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
            className="green-zone green-zone-between-nodes"
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

export default GreenZone;
