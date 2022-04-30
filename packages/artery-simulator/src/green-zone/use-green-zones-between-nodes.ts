import { map } from 'rxjs';
import { GreenZoneBetweenNodes } from '../types';
import { calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty } from '../utils';
import { useEffect, useState } from 'react';
import { hoveringContourNode$, contourNodesReport$ } from '../atoms';

export default function useGreenZonesBetweenNodes(root: Immutable.Collection<unknown, unknown>) {
  const [greenZonesBetweenNodes, setGreenZones] = useState<GreenZoneBetweenNodes[]>([]);
  useEffect(() => {
    const subscription = hoveringContourNode$.pipe(
      map((hoveringContourNode) => {
        if (!hoveringContourNode) {
          return [];
        }

        const contourNodes = contourNodesReport$.value?.contourNodes;
        if (!contourNodes?.length) {
          return [];
        }

        return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(root, hoveringContourNode, contourNodes);
      })
    ).subscribe(setGreenZones);

    return () => { subscription.unsubscribe(); };
  }, [root]);

  return greenZonesBetweenNodes;
}
