import { useRef, useEffect } from 'react';
import ElementsRadar, { Report } from '@one-for-all/elements-radar';
import { map } from 'rxjs/operators';

import { ContourNode, ContourNodesReport } from './types';
import { ALL_BACKGROUND_ELEMENTS, backgroundElementsChanged$, contourNodesReport$ } from './atoms';

export default function useElementsRadar(
  root: HTMLElement | null,
): React.MutableRefObject<ElementsRadar | undefined> {
  const radarRef = useRef<ElementsRadar>();
  useEffect(() => {
    if (!root) {
      return;
    }

    const radar = new ElementsRadar(root);
    radarRef.current = radar;

    backgroundElementsChanged$
      .pipe(
        map(() => {
          return Array.from(ALL_BACKGROUND_ELEMENTS.entries())
            .filter(([_, visible]) => visible)
            .map(([ele]) => ele);
        }),
      )
      .subscribe((elements) => radar.track(elements));

    const subscription = radar
      .getReport$()
      .pipe(
        map<Report, ContourNodesReport>((report) => {
          // TODO: batch read this for preventing reflow
          const deltaX = root.scrollLeft || 0;
          const deltaY = root.scrollTop || 0;

          const scrollHeight = root.scrollHeight || 0;
          const scrollWidth = root.scrollWidth || 0;
          // todo bug, why contour id has duplicate?
          const DUPLICATE_CONTOUR_ID = new Set<string>();
          const contourNodes: ContourNode[] = Array.from(report.entries())
            .map(([element, { relativeRect, raw }]) => {
              const id = element.dataset.simulatorNodeId;
              if (!id) {
                return;
              }

              if (DUPLICATE_CONTOUR_ID.has(id)) {
                return;
              } else {
                DUPLICATE_CONTOUR_ID.add(id);
              }

              const depth = parseInt(element.dataset.simulatorNodeDepth || '0') || 0;

              return {
                id,
                depth,
                raw,
                relativeRect,
                executor: element.dataset.simulatorNodeExecutor || '',
                absolutePosition: {
                  height: relativeRect.height,
                  width: relativeRect.width,
                  x: Math.round(relativeRect.x + deltaX),
                  y: Math.round(relativeRect.y + deltaY),
                },
              };
            })
            .filter((n): n is ContourNode => !!n);

          return { contourNodes, areaHeight: scrollHeight, areaWidth: scrollWidth };
        }),
      )
      .subscribe(contourNodesReport$);

    return () => {
      subscription.unsubscribe();
    };
  }, [root]);

  return radarRef;
}
