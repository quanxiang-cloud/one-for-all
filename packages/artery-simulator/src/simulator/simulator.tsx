import React, { useState } from 'react';

import Background from './background';
import Foreground from './foreground';
import GreenZone from './green-zone';
import { contourNodesReport$, modalLayerContourNodesReport$ } from './atoms';

import './index.scss';

function Simulator(): JSX.Element {
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={(ref) => ref && setRootElement(ref)} className="artery-simulator-root">
      {rootElement && (
        <Background
          rootElement={rootElement}
          onReport={(report) => contourNodesReport$.next(report)}
          onModalLayerReport={(report) => modalLayerContourNodesReport$.next(report)}
        />
      )}
      <GreenZone />
      <Foreground />
    </div>
  );
}

export default Simulator;
