import React, { useState } from 'react';
import cs from 'classnames';
import { Plugins } from '@one-for-all/artery-renderer';
import ArterySpec from '@one-for-all/artery';

import Background from './background';
import Foreground from './foreground';
import { ArteryCtx, IndicatorCTX } from './contexts';
import { GreenZone, SimulatorReport } from './types';
import { AllElementsCTX } from './background/contexts';
import { findNodeByID } from '@one-for-all/artery-utils';
import RenderGreenZone from './green-zone';
import './index.scss';

interface Props {
  artery: ArterySpec.Artery;
  plugins?: Plugins;
  className?: string;
  setActiveNode: (node: ArterySpec.Node) => void;
  activeNode?: ArterySpec.Node;
}

const ALL_ELEMENTS = new Map();

function Simulator({ artery, plugins, className, setActiveNode, activeNode }: Props): JSX.Element {
  const [report, setReport] = useState<SimulatorReport>();
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [greenZone, setGreenZone] = useState<GreenZone>();
  const [isShowIndicator, setShowIndicator] = useState(false);

  function optimizedSetGreenZone(newZone?: GreenZone): void {
    if (
      newZone?.hoveringNodeID !== greenZone?.hoveringNodeID ||
      newZone?.position !== greenZone?.position
    ) {
      setGreenZone(newZone);
    }
  }

  return (
    <ArteryCtx.Provider value={{ artery, rootNodeID: artery.node.id, activeNode }}>
      <IndicatorCTX.Provider value={{ setGreenZone: optimizedSetGreenZone, greenZone, setShowIndicator }}>
        <AllElementsCTX.Provider value={ALL_ELEMENTS}>
          <div className={cs('artery-simulator-root', className)}>
            <Background
              onReport={setReport}
              artery={artery}
              plugins={plugins}
              scrollPosition={scrollPosition}
            />
            {report && (
              <Foreground
                report={report}
                onScroll={setScrollPosition}
                setActiveID={(id) => {
                  const node = findNodeByID(artery.node, id);
                  if (node) {
                    setActiveNode(node);
                  }
                }}
              />
            )}
            {/* todo fix offset */}
            {isShowIndicator && greenZone && (<RenderGreenZone greenZone={greenZone} />)}
          </div>
        </AllElementsCTX.Provider>
      </IndicatorCTX.Provider>
    </ArteryCtx.Provider>
  );
}

export default Simulator;
