import React from 'react';
import type { ImmutableNode } from '@one-for-all/artery-utils';
import { Plugins } from '@one-for-all/artery-renderer';
import { Artery } from '@one-for-all/artery';

import SimulatorLayerCtx, { createLayerContextVal } from './context';
import { ContourNodesReport } from '../types';
import RenderRootLayer from './render-root-layer';

import './index.scss';

interface Props {
  artery: Artery;
  plugins?: Plugins;
  activeModalLayer?: ImmutableNode;
  rootElement: HTMLElement;
  onReport: (report?: ContourNodesReport) => void;
}

function ModalLayerRender(): React.ReactElement | null {

  return null;
}

function Background({ artery, plugins, rootElement, onReport }: Props): JSX.Element | null {

  return (
    <>
      <SimulatorLayerCtx.Provider value={createLayerContextVal()}>
        <RenderRootLayer
          artery={artery}
          plugins={plugins}
          rootElement={rootElement}
          onReport={onReport}
        />
      </SimulatorLayerCtx.Provider>
    </>
  );
}

export default Background;
