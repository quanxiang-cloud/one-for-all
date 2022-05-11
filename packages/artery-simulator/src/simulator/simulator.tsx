import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { fromJS } from 'immutable';
import { Plugins } from '@one-for-all/artery-renderer';

import Background from './background';
import Foreground from './foreground';
import GreenZone from './green-zone';
import { contourNodesReport$, immutableNodeState, modalLayerContourNodesReport$ } from './atoms';
import useModalLayers from './use-modal-layers';

import './index.scss';
import { useActiveModalLayer, useArtery } from './bridge';

export interface Props {
  plugins?: Plugins;
}

function Simulator({ plugins }: Props): JSX.Element {
  const artery = useArtery();
  const setImmutableNode = useSetRecoilState(immutableNodeState);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const modalLayerRoots = useModalLayers();
  const activeModalLayer = useActiveModalLayer();

  useEffect(() => {
    setImmutableNode(fromJS(artery.node));
  }, [artery]);

  return (
    <div ref={(ref) => ref && setRootElement(ref)} className="artery-simulator-root">
      {rootElement && (
        <Background
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
  );
}

export default Simulator;
