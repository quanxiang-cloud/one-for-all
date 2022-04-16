import React, { useImperativeHandle, useState, useEffect, useRef, Ref } from 'react';
import Radar, { Rect } from '@one-for-all/elements-radar';

import TargetArea from './target-area';
import Mirror from './mirror';
import './index.scss';

function ElementRadarDemo(): JSX.Element {
  const [visibleCells, setVisibleCells] = useState<Array<HTMLElement>>([]);
  const targetRootRef = useRef<HTMLDivElement>(null);
  const [mirrors, setMirrors] = useState<Array<{ id: string; rect: Rect; }>>([]);
  const [scrollSize, setScrollSize] = useState<{ height: number; width: number; }>({ height: 0, width: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!targetRootRef.current) {
      return;
    }

    const radar = new Radar(targetRootRef.current);
    radar.track(visibleCells);

    const subscription = radar.listen((report) => {
      const deltaX = targetRootRef.current?.scrollLeft || 0;
      const deltaY = targetRootRef.current?.scrollTop || 0;
      const mirrorCells = Array.from(report.entries()).map(([element, { rect }]) => {
        rect.x = Math.round(rect.x + deltaX);
        rect.y = Math.round(rect.y + deltaY);

        return {
          // @ts-ignore
          id: element.dataset.id as string,
          rect: rect,
        };
      });

      setScrollSize({ height: targetRootRef.current?.scrollHeight || 0, width: targetRootRef.current?.scrollWidth || 0 });
      setMirrors(mirrorCells);
    });

    return () => {
      radar.unListen(subscription)
    }
  }, [visibleCells]);

  return (
    <div>
      <h1>目标轨迹实时追踪系统</h1>
      <div style={{ display: 'flex', gap: '100px' }}>
        <div>
          <h1>检测区域</h1>
          <TargetArea
            ref={targetRootRef}
            onVisibleCellChange={setVisibleCells}
            scrollPosition={scrollPosition}
          />
        </div>
        <div>
          <h1>雷达</h1>
          <Mirror
            mirrors={mirrors}
            scrollSize={scrollSize}
            onScroll={setScrollPosition}
          />
        </div>
      </div>
    </div>
  )
}

export default ElementRadarDemo;
