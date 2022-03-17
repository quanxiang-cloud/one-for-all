import type { BehaviorSubject } from 'rxjs';

import { BaseBlocksCommunicationState } from '../type';
import useObservable from './use-observable';

export default function useLayers<T extends BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.Layer<T>[]>): PageEngineV2.Layer<T>[] {
  return useObservable<PageEngineV2.Layer<T>[]>(store$, []);
}
