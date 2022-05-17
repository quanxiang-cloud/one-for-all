import { useRef, useEffect, useContext } from 'react';
import ElementsRadar, { Report } from '@one-for-all/elements-radar';
import { map, filter } from 'rxjs/operators';

import { ContourNode, ContourNodesReport } from '../../types';
import SimulatorLayerCtx from './context';

export default function useElementsRadar(
  onReport: (report?: ContourNodesReport) => void,
  root?: HTMLElement,
): React.MutableRefObject<ElementsRadar | undefined> {
  const { monitoredElements$ } = useContext(SimulatorLayerCtx);
  const radarRef = useRef<ElementsRadar>();

  useEffect(() => {
    if (!root) {
      return;
    }

    const radar = new ElementsRadar(root);
    radarRef.current = radar;

    monitoredElements$
      .pipe(
        map((monitoredElements) => {
          return Array.from(monitoredElements.entries())
            .filter(([_, visible]) => visible)
            .map(([ele]) => ele);
        }),
        filter((elements) => !!elements.length),
      )
      .subscribe((elements) => radar.track(elements));

    const subscription = radar
      .getReport$()
      .pipe(
        map<Report, ContourNodesReport>((report) => {
          // TODO: batch read this for preventing reflow
          const deltaX = window.document.body.scrollLeft || 0;
          const deltaY = window.document.body.scrollTop || 0;

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
                  x: relativeRect.x,
                  y: relativeRect.y,
                  // x: Math.round(relativeRect.x + deltaX),
                  // y: Math.round(relativeRect.y + deltaY),
                },
              };
            })
            .filter((n): n is ContourNode => !!n);

          return { contourNodes, areaHeight: scrollHeight, areaWidth: scrollWidth };
        }),
      )
      .subscribe(onReport);

    return () => {
      subscription.unsubscribe();
    };
  }, [root]);

  return radarRef;
}
