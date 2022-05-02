import React, { useState } from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';
import { nanoid } from 'nanoid';

import repository from './repository';
import arteryForTestingSimulator from './artery-for-testing-simulator';
import ArterySpec from '@one-for-all/artery';
import { isSupportChildren } from './helper';

import './index.scss';

function genNodeID(): string {
  return nanoid();
}

function SimulatorInExample(): JSX.Element {
  const [activeNode, setActiveNode] = useState<ArterySpec.Node>();
  const [artery, setArtery] = useState(arteryForTestingSimulator);

  return (
    <ArterySimulator
      artery={artery}
      plugins={{ repository }}
      activeNode={activeNode}
      genNodeID={genNodeID}
      setActiveNode={setActiveNode}
      onChange={setArtery}
      isNodeSupportChildren={isSupportChildren}
    />
  );
}

export default SimulatorInExample;
