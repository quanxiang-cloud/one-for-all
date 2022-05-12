import React, { useState, useMemo } from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';
import { travel } from '@one-for-all/artery-utils';
import { nanoid } from 'nanoid';

import repository from './repository';
import arteryForTestingSimulator from './artery-for-testing-simulator';
import ArterySpec, { Artery, Node } from '@one-for-all/artery';
import { isNodeInModalLayer, isSupportChildren } from './helper';

import './index.scss';

function genNodeID(): string {
  return nanoid();
}

interface RenderModalLayerSelectorProps {
  artery: Artery;
  setActiveModalLayer: (id?: string) => void;
}

function RenderModalLayerSelector({ artery, setActiveModalLayer }: RenderModalLayerSelectorProps): JSX.Element {
  const modalLayerRoots = useMemo(() => {
    const modalLayerRoots: Array<Node> = []
    travel(artery.node, {
      reactComponentNode: (currentNode): undefined => {
        if (currentNode.exportName === 'Modal') {
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

  return (
    <div>
      <RenderModalLayerSelector
        artery={artery}
        setActiveModalLayer={setActiveModalLayer}
      />
      <ArterySimulator
        className="artery-simulator"
        artery={artery}
        pluginsSrc="/dist/temporaryPlugins.js"
        activeNode={activeNode}
        // genNodeID={genNodeID}
        activeModalLayer={activeModalLayer}
        setActiveModalLayer={setActiveModalLayer}
        setActiveNode={setActiveNode}
        onChange={setArtery}
        isNodeSupportChildren={isSupportChildren}
        isNodeInModalLayer={isNodeInModalLayer}
      />
    </div>
  );
}

export default SimulatorInExample;
