import { useRef, useEffect, useContext } from 'react';
import ElementsRadar, { Report } from '@one-for-all/elements-radar';
import { map, filter } from 'rxjs/operators';

import { ContourNode, ContourNodesReport } from '../../types';
import MonitoredElementsContext from './context';

export default function useElementsRadar(
  onReport: (report?: ContourNodesReport) => void,
  root?: HTMLElement,
): React.MutableRefObject<ElementsRadar | undefined> {
  const monitoredElements$ = useContext(MonitoredElementsContext);
  const radarRef = useRef<ElementsRadar>();

  useEffect(() => {
    const radar = new ElementsRadar(root);
    radarRef.current = radar;

    monitoredElements$
      .pipe(
        filter((elements) => !!elements.size),
      )
      .subscribe((elements) => radar.track(Array.from(elements)));

    const subscription = radar
      .getReport$()
      .pipe(
        map<Report, ContourNodesReport>((report) => {
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
              const { x: offsetX, y: offsetY } = document.body.getBoundingClientRect();

              return {
                id,
                depth,
                raw,
                relativeRect,
                executor: element.dataset.simulatorNodeExecutor || '',
                absolutePosition: {
                  height: relativeRect.height,
                  width: relativeRect.width,
                  // when root is undefine, the comparing root will be viewport,
                  // the relativeRect is relative to viewport,
                  x: root ? relativeRect.x : relativeRect.x - offsetX,
                  y: root ? relativeRect.y : relativeRect.y - offsetY,
                },
              };
            })
            .filter((n): n is ContourNode => !!n);

          return { contourNodes };
        }),
      )
      .subscribe(onReport);

    return () => {
      subscription.unsubscribe();
    };
  }, [root]);

  return radarRef;
}
