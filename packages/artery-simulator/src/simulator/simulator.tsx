import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { useSetRecoilState } from 'recoil';
import { fromJS } from 'immutable';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery, Node } from '@one-for-all/artery';

import Background from './background';
import Foreground from './foreground';
import { NodePrimary } from '../types';
import GreenZone from './green-zone';
import { contourNodesReport$, immutableNodeState, modalLayerContourNodesReport$ } from './atoms';
import useModalLayers from './use-modal-layers';

import './index.scss';
import { useArtery } from './bridge';

export interface Props {
  setActiveNode: (node?: Node) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer: string) => void;

  plugins?: Plugins;
  className?: string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
}

function Simulator({
  className,
  activeModalLayer,

  plugins,
}: Props): JSX.Element {
  const artery = useArtery();
  const setImmutableNode = useSetRecoilState(immutableNodeState);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const modalLayerRoots = useModalLayers();

  useEffect(() => {
    setImmutableNode(fromJS(artery.node));
  }, [artery]);

  return (
    <div ref={(ref) => ref && setRootElement(ref)} className={cs('artery-simulator-root', className)}>
      {rootElement && (
        <Background
          plugins={plugins}
          rootElement={rootElement}
          onReport={(report) => contourNodesReport$.next(report)}
          onModalLayerReport={(report) => modalLayerContourNodesReport$.next(report)}
          activeModalLayer={modalLayerRoots.find(
            (layerRoot) => layerRoot.getIn(['id']) === activeModalLayer,
          )}
        />
      )}
      <GreenZone />
      <Foreground />
    </div>
  );
}

export default Simulator;
