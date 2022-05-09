import React from 'react';

import { inDnd$ } from '../atoms';
import useGreenZoneReport from './use-green-zone-report';
import RenderGreenZoneForNodeWithoutChildren from './render-green-zone-for-node-without-children';
import RenderGreenZonesBetweenNodes from './render-green-zones-between-nodes';

function GreenZone(): JSX.Element | null {
  const greenZoneReport = useGreenZoneReport();

  if (!inDnd$.value || !greenZoneReport) {
    return null;
  }

  if (Array.isArray(greenZoneReport)) {
    return <RenderGreenZonesBetweenNodes greenZones={greenZoneReport} />;
  }

  return <RenderGreenZoneForNodeWithoutChildren greenZone={greenZoneReport} />;
}

export default GreenZone;
