import { useEffect, useState } from 'react';
import { map } from 'rxjs';
import { GreenZoneForNodeWithoutChildren, GreenZoneBetweenNodes } from '../types';
import { calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty } from './green-zone-helpers';
import { hoveringContourNode$, contourNodesReport$, immutableNodeState } from '../atoms';
import { byArbitrary, nodeHasChildNodes } from '@one-for-all/artery-utils';
import { useRecoilValue } from 'recoil';

export default function useGreenZoneReport() {
  const root = useRecoilValue(immutableNodeState)
  const [greenZonesBetweenNodes, setGreenZones] = useState<GreenZoneBetweenNodes[] | GreenZoneForNodeWithoutChildren>([]);
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

        const hoveringNodeKeyPath = byArbitrary(root, hoveringContourNode.id);
        if (!hoveringNodeKeyPath) {
          return [];
        }

        const hoveringArteryNode = root.getIn(hoveringNodeKeyPath) as Immutable.Collection<unknown, unknown>;
        const hasChild = nodeHasChildNodes(hoveringArteryNode);
        if (!hasChild) {
          return { contour: hoveringContourNode };
        }

        return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(root, hoveringContourNode, contourNodes);
      })
    ).subscribe(setGreenZones);

    return () => { subscription.unsubscribe(); };
  }, [root]);

  return greenZonesBetweenNodes;
}
