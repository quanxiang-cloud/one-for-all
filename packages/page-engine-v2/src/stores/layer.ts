import { BehaviorSubject } from "rxjs";
import { over, lensPath } from 'ramda';

import { BaseBlocksCommunicationState } from "../type";

function add<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layer: PageEngineV2.Layer<T>): void {
  store$.next([...store$.value, layer]);
}

export function create<T extends BaseBlocksCommunicationState>(layers?: PageEngineV2.Layer<T>[]): BehaviorSubject<PageEngineV2.Layer<T>[]> {
  return new BehaviorSubject<PageEngineV2.Layer<T>[]>(layers ?? []);
}

export function set<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layers: PageEngineV2.Layer<T>[]): void {
  store$.next(layers);
}

export function registryLayers<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layers: PageEngineV2.Layer<T>[]): void {
  layers.forEach(layer => add<T>(store$, layer));
}

export function setLayerByIndex<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layer: PageEngineV2.Layer<T>, index: number): void {
  set(store$, over(lensPath([index]), () => layer, store$.value));
}
