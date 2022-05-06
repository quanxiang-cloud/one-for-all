import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { useSetRecoilState } from 'recoil';
import { fromJS } from 'immutable';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import Background from './background';
import Foreground from './foreground';
import { ArteryCtx } from './contexts';
import { NodePrimary } from './types';
import GreenZone from './green-zone';
import { immutableNodeState } from './atoms';
import './index.scss';
import useElementsRadar from './use-radar-ref';

export interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  plugins?: Plugins;
  className?: string;
  genNodeID: () => string;
  isNodeSupportChildren?: (parent: NodePrimary) => Promise<boolean>;
  onDropFile?: (file: File) => Promise<string>;
  modalLayerNodes?: Array<NodePrimary>;
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
  const setImmutableNode = useSetRecoilState(immutableNodeState);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  useElementsRadar(rootElement);

  useEffect(() => {
    setImmutableNode(fromJS(artery.node));
  }, [artery]);

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
      <div
        ref={(ref) => {
          if (ref) {
            setRootElement(ref);
          }
        }}
        className={cs('artery-simulator-root', className)}
      >
        <Background artery={artery} plugins={plugins} />
        <GreenZone />
        <Foreground />
      </div>
    </ArteryCtx.Provider>
  );
}

export default Simulator;
