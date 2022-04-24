import type { BehaviorSubject } from 'rxjs';
import React from 'react';

import Layer from './components/layer';
import { useObservable } from './hooks';
import { setLayerByIndex } from './stores/layer';

interface Props<T> {
  layersStore$: BehaviorSubject<ArteryEngine.Layer<T>[]>;
}

export default function Core<T extends ArteryEngine.BaseBlocksCommunicationState>({ layersStore$ }: Props<T>): JSX.Element {
  const layers = useObservable<ArteryEngine.Layer<T>[]>(layersStore$, []);

  function getSetLayer(index: number): (transfer: ArteryEngine.LayerTransfer<T>) => void {
    return (transfer: ArteryEngine.LayerTransfer<T>) => {
      setLayerByIndex(layersStore$, transfer(layers[index]), index);
    }
  }

  return (
    <>
      {layers.map((layer, index) => (
        <Layer<T> {...layer} key={index} zIndex={index} setLayer={getSetLayer(index)} />
      ))}
    </>
  )
}
