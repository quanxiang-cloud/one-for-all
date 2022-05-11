import { BehaviorSubject } from 'rxjs';
import { ifElse, lensPath, over, when, or, and, mergeRight } from 'ramda';
import React, { useMemo, useEffect, useCallback } from 'react';

import { useEngineStoreContext } from '@arteryEngine/context';

import Layer from './components/layer';
import { useObservable } from './hooks';
import { isObject } from './utils';

interface Props<T> {
  layersStore$: BehaviorSubject<ArteryEngine.Layer<T>[]>;
  blocksCommunicationStateInitialValue: T;
}

export default function Core<T extends ArteryEngine.BaseBlocksCommunicationState>(props: Props<T>): JSX.Element {
  const { layersStore$, blocksCommunicationStateInitialValue } = props
  const layers = useObservable<ArteryEngine.Layer<T>[]>(layersStore$, []);
  const engineStore$ = useEngineStoreContext();
  const blocksCommunicationState$ = useMemo(() => new BehaviorSubject<T>(blocksCommunicationStateInitialValue), []);

  useEffect(() => {
    engineStore$.setBlocksCommunicationState<T>(blocksCommunicationState$);
  }, []);

  const updateLayer = useCallback(({ layerId, blockId, name, value }: ArteryEngine.UpdateLayer) => {
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    const layer = layers[layerIndex] as ArteryEngine.Layer<T> | undefined;
    const blockIndex = layer?.blocks.findIndex(block => block.id === blockId) ?? -1;

    const getValue = (leftValue: unknown, rightvalue: unknown): unknown => {
      const isAllObject = isObject(leftValue) && isObject(rightvalue);
      return isAllObject ? mergeRight(leftValue, rightvalue) : rightvalue;
    }

    const updater = (): void => {
      const getNewLayers = ifElse(
        () => !blockId,
        () => over(
          lensPath([layerIndex]),
          layer => Object.assign(layer, { [name]: getValue(layer[name as keyof ArteryEngine.Layer<T>], value)}),
          layers
        ),
        () => over(
          lensPath([layerIndex, 'blocks', blockIndex]),
          block => Object.assign(block, { [name]: getValue(block[name as keyof ArteryEngine.Block<T>], value)}),
          layers
        )
      )
      layersStore$.next(getNewLayers());
    }

    const updateWhenExists = when((layer): boolean => or(and(!!layer, !blockId), and(!!blockId, blockIndex !== -1)), updater);
    updateWhenExists(layer);
  }, [layersStore$, layers]);

  const hideFilter = useCallback((layer: ArteryEngine.Layer<T>): boolean => {
    return layer.hide !== true;
  }, []);

  return (
    <>
      {layers.filter(hideFilter).map((layer, index) => (
        <Layer<T>
          {...layer}
          key={layer.id!}
          zIndex={index}
          updateLayer={updateLayer}
        />
      ))}
    </>
  )
}
