import React, { useEffect, useState } from 'react';

import { inDnd$ } from '../atoms';
import useGreenZoneReport from './use-green-zone-report';
import RenderGreenZoneForNodeWithoutChildren from './render-green-zone-for-node-without-children';
import RenderGreenZonesBetweenNodes from './render-green-zones-between-nodes';
import { distinctUntilChanged } from 'rxjs';

// todo util hook
function useInDnd(): boolean {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const subscription = inDnd$.pipe(
      distinctUntilChanged(),
    ).subscribe(setFlag);

    return () => { subscription.unsubscribe() };
  }, [])

  return flag;
}

function GreenZone(): JSX.Element | null {
  const greenZoneReport = useGreenZoneReport();
  const inDnd = useInDnd();

  if (!inDnd || !greenZoneReport) {
    return null;
  }

  if (Array.isArray(greenZoneReport)) {
    return <RenderGreenZonesBetweenNodes greenZones={greenZoneReport} />;
  }

  return <RenderGreenZoneForNodeWithoutChildren greenZone={greenZoneReport} />;
}

export default GreenZone;
