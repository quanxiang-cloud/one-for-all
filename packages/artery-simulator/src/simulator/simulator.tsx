import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { useSetRecoilState } from 'recoil';
import { fromJS } from 'immutable';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import Background from './background';
import Foreground from './foreground';
import { ArteryCtx } from './contexts';
import { NodePrimary } from '../types';
import GreenZone from './green-zone';
import { contourNodesReport$, immutableNodeState, modalLayerContourNodesReport$ } from './atoms';
import './index.scss';
import useModalLayers from './use-modal-layers';

export interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer: string) => void;

  plugins?: Plugins;
  className?: string;
  genNodeID: () => string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
  onDropFile?: (file: File) => Promise<string>;
}

function Simulator({
  artery,
  onChange,

  className,
  setActiveNode,
  activeNode,
  activeModalLayer,

  plugins,
  genNodeID,
  isNodeSupportChildren,
  isNodeInModalLayer,
  onDropFile,
}: Props): JSX.Element {
  const setImmutableNode = useSetRecoilState(immutableNodeState);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const modalLayerRoots = useModalLayers();

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
        isNodeInModalLayer,
        onDropFile,
        onChange,
        genNodeID,
      }}
    >
      <div ref={(ref) => ref && setRootElement(ref)} className={cs('artery-simulator-root', className)}>
        {rootElement && (
          <Background
            artery={artery}
            plugins={plugins}
            rootElement={rootElement}
            onReport={(report) => contourNodesReport$.next(report)}
            onModalLayerReport={(report) => modalLayerContourNodesReport$.next(report)}
            activeModalLayer={modalLayerRoots.find((layerRoot) => layerRoot.getIn(['id']) === activeModalLayer)}
          />
        )}
        <GreenZone />
        <Foreground />
      </div>
    </ArteryCtx.Provider>
  );
}

export default Simulator;
