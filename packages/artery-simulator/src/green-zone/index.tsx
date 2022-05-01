import React from 'react';

import { draggingNodeIDState } from '../atoms';
import { useRecoilState } from 'recoil';
import useGreenZoneReport from './use-green-zone-report';
import RenderGreenZoneForNodeWithoutChildren from './render-green-zone-for-node-without-children';
import RenderGreenZonesBetweenNodes from './render-green-zones-between-nodes';

function GreenZone(): JSX.Element | null {
  const greenZoneReport = useGreenZoneReport();
  const [draggingNodeID] = useRecoilState(draggingNodeIDState);

  if (!draggingNodeID || !greenZoneReport) {
    return null;
  }

  if (Array.isArray(greenZoneReport)) {
    return (<RenderGreenZonesBetweenNodes greenZones={greenZoneReport} />);
  }

  return (<RenderGreenZoneForNodeWithoutChildren contour={greenZoneReport.contour} />);
}

export default GreenZone;


