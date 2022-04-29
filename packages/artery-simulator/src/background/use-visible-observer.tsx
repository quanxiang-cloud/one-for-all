import { useRef, useEffect, useContext, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { logger } from '@one-for-all/utils';
import ElementsRadar from '@one-for-all/elements-radar';

import { SimulatorReport, VisibleNode } from '../types';
import { AllElementsCTX } from './contexts';
import { visibleElementsTickState } from '../atoms';
import { useNextTick } from '../utils';

function useObserverCallback(): IntersectionObserverCallback {
  const allElements = useContext(AllElementsCTX);
  const tick = useNextTick();

  return (entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      allElements.set(target as HTMLElement, isIntersecting);
    });

    tick();
  };
}

function useRadarRef(
  onReport: (report: SimulatorReport) => void,
  root: HTMLElement | null,
): React.MutableRefObject<ElementsRadar | undefined> {
  const radarRef = useRef<ElementsRadar>();
  useEffect(() => {
    if (!root) {
      return;
    }

    const radar = new ElementsRadar(root);
    radarRef.current = radar;
    const subscription = radar.listen((report) => {
      const n1 = performance.now();
      // TODO: batch read this for preventing reflow
      const deltaX = root.scrollLeft || 0;
      const deltaY = root.scrollTop || 0;
      const scrollHeight = root.scrollHeight || 0;
      const scrollWidth = root.scrollWidth || 0;
      const visibleNodes: VisibleNode[] = Array.from(report.entries()).map(
        ([element, { relativeRect, raw }]) => {
          return {
            raw,
            relativeRect,
            id: element.dataset.simulatorNodeId || '',
            visible: true,
            executor: element.dataset.simulatorNodeExecutor || '',
            absolutePosition: {
              height: relativeRect.height,
              width: relativeRect.width,
              x: Math.round(relativeRect.x + deltaX),
              y: Math.round(relativeRect.y + deltaY),
            },
          };
        },
      );
      onReport({ visibleNodes, areaHeight: scrollHeight, areaWidth: scrollWidth });
      const n2 = performance.now();

      logger.debug('calc visible nodes cost:', n2 - n1);
    });

    return () => {
      radar.unListen(subscription);
    };
  }, [root]);

  return radarRef;
}

function useVisibleObserver(
  onReport: (report: SimulatorReport) => void,
  root: HTMLElement | null,
): IntersectionObserver {
  const allElements = useContext(AllElementsCTX);
  const [n] = useRecoilState(visibleElementsTickState);
  const radarRef = useRadarRef(onReport, root);
  const visibleObserverRef = useRef<IntersectionObserver>(
    new IntersectionObserver(useObserverCallback(), { root }),
  );

  const latestVisibleElements = useMemo(() => {
    return Array.from(allElements.entries())
      .filter(([_, isVisible]) => isVisible)
      .map(([ele]) => ele);
  }, [n]);

  useEffect(() => {
    radarRef.current?.track(latestVisibleElements);
  }, [latestVisibleElements]);

  return visibleObserverRef.current;
}

export default useVisibleObserver;
