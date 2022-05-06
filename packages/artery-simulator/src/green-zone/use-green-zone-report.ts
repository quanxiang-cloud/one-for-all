import { useEffect, useState } from 'react';
import { animationFrames, audit, distinctUntilChanged, map } from 'rxjs';
import { GreenZoneForNodeWithoutChildren, GreenZoneInsideNode, ContourNode } from '../types';
import { calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty } from './green-zone-helpers';
import { hoveringContourNode$, contourNodesReport$, immutableNodeState } from '../atoms';
import { byArbitrary, nodeHasChildNodes } from '@one-for-all/artery-utils';
import { useRecoilValue } from 'recoil';

export default function useGreenZoneReport() {
  const root = useRecoilValue(immutableNodeState);
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

            const contourNodes = contourNodesReport$.value?.contourNodes;
            if (!contourNodes?.length) {
              return [];
            }

            const hoveringNodeKeyPath = byArbitrary(root, hoveringContourNode.id);
            if (!hoveringNodeKeyPath) {
              return [];
            }

            const hoveringArteryNode = root.getIn(hoveringNodeKeyPath) as Immutable.Collection<
              unknown,
              unknown
            >;
            const hasChild = nodeHasChildNodes(hoveringArteryNode);
            if (!hasChild) {
              return { contour: hoveringContourNode, type: 'node_without_children', position: 'left' };
            }

            return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(
              root,
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
  }, [root]);

  return greenZonesBetweenNodes;
}
