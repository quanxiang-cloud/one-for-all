import type { BehaviorSubject } from 'rxjs';

import useObservable from './use-observable';

export default function useLayers<T>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>): PageEngineV2.Layer<T>[] {
  return useObservable<PageEngineV2.Layer<T>[]>(store$, []);
}
