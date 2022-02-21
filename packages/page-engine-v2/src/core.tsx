import type { BehaviorSubject } from 'rxjs';
import React, { Fragment } from 'react';

import Layer from './components/layer';
import { useObservable } from './hooks';

interface Props<T extends PageEngineV2.BaseBlocksCommunicationState> {
  layersStore$: BehaviorSubject<PageEngineV2.Layer<T>[]>;
  engineId: string;
}

export default function Core<T extends PageEngineV2.BaseBlocksCommunicationState>({ layersStore$, engineId }: Props<T>): JSX.Element {
  const layers = useObservable<PageEngineV2.Layer<T>[]>(layersStore$, []);

  return (
    <Fragment>
      {layers.map((layer, index) => (
        <Layer<T> {...layer} key={index} zIndex={index} engineId={engineId} />
      ))}
    </Fragment>
  )
}
