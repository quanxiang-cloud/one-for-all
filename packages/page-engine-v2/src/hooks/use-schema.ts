import { Artery } from '@one-for-all/artery';
import type { BehaviorSubject } from 'rxjs';

import useObservable from './use-observable';

export default function useSchema(store$: BehaviorSubject<Artery>, defaultSchema: Artery): Artery {
  return useObservable<Artery>(store$, defaultSchema);
}
