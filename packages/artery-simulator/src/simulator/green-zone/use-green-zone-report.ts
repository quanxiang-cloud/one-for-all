import { useEffect, useState } from 'react';
import { animationFrames, audit, distinctUntilChanged, map } from 'rxjs';
import { byArbitrary, nodeHasChildNodes } from '@one-for-all/artery-utils';

import { GreenZoneForNodeWithoutChildren, GreenZoneInsideNode, ContourNode } from '../../types';
import { calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty } from './green-zone-helpers';
import { hoveringContourNode$, contourNodesReport$ } from '../states-center';
import { immutableRoot$ } from '../states-center';

export default function useGreenZoneReport() {
  const [greenZonesBetweenNodes, setGreenZones] = useState<
    Array<GreenZoneInsideNode> | GreenZoneForNodeWithoutChildren
  >([]);

  useEffect(() => {
    const subscription = hoveringContourNode$
      .pipe(
        distinctUntilChanged(),
        audit(() => animationFrames()),
        map<ContourNode | undefined, Array<GreenZoneInsideNode> | GreenZoneForNodeWithoutChildren>(
          (hoveringContourNode) => {
            if (!hoveringContourNode) {
              return [];
            }

            const contourNodes = contourNodesReport$.value;
            if (!contourNodes?.length) {
              return [];
            }

            const hoveringNodeKeyPath = byArbitrary(immutableRoot$.value, hoveringContourNode.id);
            if (!hoveringNodeKeyPath) {
              return [];
            }

            const hoveringArteryNode = immutableRoot$.value.getIn(
              hoveringNodeKeyPath,
            ) as Immutable.Collection<unknown, unknown>;
            const hasChild = nodeHasChildNodes(hoveringArteryNode);
            if (!hasChild) {
              return { contour: hoveringContourNode, type: 'node_without_children', position: 'left' };
            }

            return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(
              immutableRoot$.value,
              hoveringContourNode,
              contourNodes,
            );
          },
        ),
      )
      .subscribe(setGreenZones);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return greenZonesBetweenNodes;
}
