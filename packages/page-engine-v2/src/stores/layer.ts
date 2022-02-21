import { BehaviorSubject } from "rxjs";

function add<T>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layer: PageEngineV2.Layer<T>): void {
  store$.next([...store$.value, layer]);
}

export function create<T>(layers?: PageEngineV2.Layer<T>[]): BehaviorSubject<PageEngineV2.Layer<T>[]> {
  return new BehaviorSubject<PageEngineV2.Layer<T>[]>(layers ?? []);
}

export function set<T>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layers: PageEngineV2.Layer<T>[]): void {
  store$.next(layers);
}

export function registryLayers<T>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>, layers: PageEngineV2.Layer<T>[]): void {
  layers.forEach(layer => add<T>(store$, layer));
}
