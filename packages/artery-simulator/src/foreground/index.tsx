import React from 'react';

import { SimulatorReport } from '../types';
import ShadowNodes from './shadow-nodes';
import { debounce } from '../utils';

import './index.scss';

interface Props {
  report: SimulatorReport;
  onScroll: (position: { x: number; y: number }) => void;
  setActiveID: (id: string) => void;
}

function Foreground({ report, onScroll, setActiveID }: Props): JSX.Element {
  function handleScroll(e: React.UIEvent<HTMLElement>): void {
    // @ts-ignore
    onScroll({ x: e.target.scrollLeft, y: e.target.scrollTop });
  }

  return (
    <div className="simulator-foreground" onScroll={debounce(handleScroll)}>
      <div className="foreground-scroll" style={{ height: `${report.areaHeight}px`, width: `${report.areaWidth}px` }} />
      <ShadowNodes nodes={report.visibleNodes} setActiveID={setActiveID} />
    </div>
  );
}

export default Foreground;
