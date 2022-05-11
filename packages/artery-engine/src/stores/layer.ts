import { BehaviorSubject } from "rxjs";

import { BaseBlocksCommunicationState } from "../type";

function add<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<ArteryEngine.Layer<T>[]>, layer: ArteryEngine.Layer<T>): void {
  store$.next([...store$.value, layer]);
}

export function create<T extends BaseBlocksCommunicationState>(layers?: ArteryEngine.Layer<T>[]): BehaviorSubject<ArteryEngine.Layer<T>[]> {
  return new BehaviorSubject<ArteryEngine.Layer<T>[]>(layers ?? []);
}

export function set<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<ArteryEngine.Layer<T>[]>, layers: ArteryEngine.Layer<T>[]): void {
  store$.next(layers);
}

export function registryLayers<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<ArteryEngine.Layer<T>[]>, layers: ArteryEngine.Layer<T>[]): void {
  layers.forEach(layer => add<T>(store$, layer));
}
