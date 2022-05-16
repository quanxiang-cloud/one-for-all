import React, { useEffect, useState, useMemo, useRef } from 'react';
import ArterySimulator, { SimulatorRef } from '@one-for-all/artery-simulator';
import { travel } from '@one-for-all/artery-utils';

import arteryForTestingSimulator from './artery-for-testing-simulator';
import ArterySpec, { Artery, Node } from '@one-for-all/artery';
import { isSupportChildren } from './helper';

import './index.scss';

interface RenderModalLayerSelectorProps {
  artery: Artery;
  setActiveModalLayer: (id?: string) => void;
}

function RenderModalLayerSelector({ artery, setActiveModalLayer }: RenderModalLayerSelectorProps): JSX.Element {
  const modalLayerRoots = useMemo(() => {
    const modalLayerRoots: Array<Node> = []
    travel(artery.node, {
      reactComponentNode: (currentNode): undefined => {
        if (currentNode.exportName === 'MediocreDialog') {
          modalLayerRoots.push(currentNode)
        }

        return;
      }
    })
    return modalLayerRoots;
  }, [artery]);

  return (
    <div>
      <h3>modal layers</h3>
      <div onClick={() => setActiveModalLayer()} >show root</div>
      {modalLayerRoots.map((modalNode) => {
        return (
          <div
            key={modalNode.id}
            className="modal-layer-root-name"
            onClick={() => setActiveModalLayer(modalNode.id)}
          >
            {modalNode.label || modalNode.id}
          </div>
        )
      })}
    </div>
  )
}

function SimulatorInExample(): JSX.Element {
  const [activeNode, setActiveNode] = useState<ArterySpec.Node>();
  const [artery, setArtery] = useState(arteryForTestingSimulator);
  const [activeModalLayer, setActiveModalLayer] = useState<string | undefined>('');
  const simulatorRef = useRef<SimulatorRef>(null);

  // useEffect(() => {
  //   console.log(simulatorRef.current?.iframe)
  // }, []);

  return (
    <div>
      <RenderModalLayerSelector
        artery={artery}
        setActiveModalLayer={setActiveModalLayer}
      />
      <ArterySimulator
        ref={simulatorRef}
        className="artery-simulator"
        artery={artery}
        pluginsSrc="/dist/temporaryPlugins.js"
        activeNode={activeNode}
        activeOverLayerNodeID={activeModalLayer}
        setActiveOverLayerNodeID={setActiveModalLayer}
        setActiveNode={setActiveNode}
        onChange={setArtery}
        isNodeSupportChildren={isSupportChildren}
      />
    </div>
  );
}

export default SimulatorInExample;
