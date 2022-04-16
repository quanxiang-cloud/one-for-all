import React, { useState } from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';

import repository from './repository';
import arteryForTestingSimulator from './artery-for-testing-simulator';
import ArterySpec from 'packages/artery/src';

function SimulatorInExample(): JSX.Element {
  const [activeNode, setActiveNode] = useState<ArterySpec.Node>();

  return (
    <ArterySimulator
      artery={arteryForTestingSimulator}
      plugins={{ repository }}
      activeNode={activeNode}
      setActiveNode={setActiveNode}
    />
  )
}

export default SimulatorInExample;
