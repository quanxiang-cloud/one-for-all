import { Artery } from '@one-for-all/artery';

import useObservable from './use-observable';
import { useEngineStoreContext } from '../context';

export default function useArtery(): Artery | undefined {
  const engineStore$ = useEngineStoreContext();
  const { arteryStore$ } = useObservable(engineStore$, {});
  return useObservable<Artery | undefined>(arteryStore$, undefined);
}
