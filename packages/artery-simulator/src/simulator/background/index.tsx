import React from 'react';

import ModalLayerRender from './modal-layer-render';
import RootLayerRenderLayer from './root-layer-render';

function Background(): JSX.Element | null {
  return (
    <>
      <RootLayerRenderLayer />
      <ModalLayerRender />
    </>
  );
}

export default Background;
