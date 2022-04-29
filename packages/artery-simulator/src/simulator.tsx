import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { useSetRecoilState } from 'recoil';
import { fromJS } from 'immutable';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import Background from './background';
import Foreground from './foreground';
import { ArteryCtx } from './contexts';
import { NodeWithoutChild, SimulatorReport } from './types';
import { AllElementsCTX, VisibleObserverCTX } from './background/contexts';
import RenderGreenZone from './green-zone';
import { immutableNodeState, isScrollingState } from './atoms';
import useVisibleObserver from './background/use-visible-observer';
import './index.scss';

export interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  plugins?: Plugins;
  className?: string;
  genNodeID: () => string;
  isNodeSupportChildren?: (parent: NodeWithoutChild) => Promise<boolean>;
  onDropFile?: (file: File) => Promise<string>;
}

const ALL_ELEMENTS = new Map();

function Simulator({
  artery,
  onChange,

  className,
  setActiveNode,
  activeNode,

  plugins,
  genNodeID,
  isNodeSupportChildren,
  onDropFile,
}: Props): JSX.Element {
  const [report, setReport] = useState<SimulatorReport>();
  const setImmutableNode = useSetRecoilState(immutableNodeState);
  // todo move this into RenderGreenZone
  const simulatorRef = useRef<HTMLDivElement>(null);

  const visibleObserver = useVisibleObserver(setReport, simulatorRef.current);
  useEffect(() => {
    setImmutableNode(fromJS(artery.node));
  }, [artery]);

  const timeRef = useRef<number>();
  const setIsScrolling = useSetRecoilState(isScrollingState);

  function handleScroll(): void {
    setIsScrolling(true);
    clearTimeout(timeRef.current);
    timeRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }

  return (
    <ArteryCtx.Provider
      value={{
        artery,
        rootNodeID: artery.node.id,
        activeNode,
        setActiveNode,
        isNodeSupportChildren,
        onDropFile,
        onChange,
        genNodeID,
      }}
    >
      <AllElementsCTX.Provider value={ALL_ELEMENTS}>
        <VisibleObserverCTX.Provider value={visibleObserver}>
          <div
            ref={simulatorRef}
            className={cs('artery-simulator-root', className)}
            onScroll={handleScroll}
          >
            <Background
              artery={artery}
              plugins={plugins}
            />
            {report && <Foreground report={report} />}
            <RenderGreenZone />
          </div>
        </VisibleObserverCTX.Provider>
      </AllElementsCTX.Provider>
    </ArteryCtx.Provider>
  );
}

export default Simulator;
