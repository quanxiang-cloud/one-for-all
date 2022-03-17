import type { BehaviorSubject } from 'rxjs';
import React, { Fragment } from 'react';

import Layer from './components/layer';
import { useObservable } from './hooks';
import { setLayerByIndex } from './stores/layer';

interface Props<T extends PageEngineV2.BaseBlocksCommunicationState> {
  layersStore$: BehaviorSubject<PageEngineV2.Layer<T>[]>;
  engineId: string;
}

export default function Core<T extends PageEngineV2.BaseBlocksCommunicationState>({ layersStore$, engineId }: Props<T>): JSX.Element {
  const layers = useObservable<PageEngineV2.Layer<T>[]>(layersStore$, []);

  function getSetLayer(index: number): (transfer: PageEngineV2.LayerTransfer<T>) => void {
    return (transfer: PageEngineV2.LayerTransfer<T>) => {
      setLayerByIndex(layersStore$, transfer(layers[index]), index);
    }
  }

  return (
    <Fragment>
      {layers.map((layer, index) => (
        <Layer<T> {...layer} key={index} zIndex={index} engineId={engineId} setLayer={getSetLayer(index)} />
      ))}
    </Fragment>
  )
}
