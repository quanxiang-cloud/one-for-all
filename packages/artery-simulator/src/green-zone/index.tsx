import React from 'react';

import { draggingNodeIDState } from '../atoms';
import { useRecoilState } from 'recoil';
import useGreenZoneReport from './use-green-zone-report';
import GreenZoneForNodeWithoutChildren from './green-zone-for-node-without-children';

function GreenZone(): JSX.Element | null {
  const greenZoneReport = useGreenZoneReport();
  const [draggingNodeID] = useRecoilState(draggingNodeIDState);

  if (!draggingNodeID || !greenZoneReport) {
    return null;
  }

  if (Array.isArray(greenZoneReport)) {
    return (
      <>
        {greenZoneReport.map(({ left, right, absolutePosition }) => {
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

  return (<GreenZoneForNodeWithoutChildren contour={greenZoneReport.contour} />);
}

export default GreenZone;
