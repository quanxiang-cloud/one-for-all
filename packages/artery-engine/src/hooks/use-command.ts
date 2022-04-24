import useObservable from './use-observable';
import { useEngineStoreContext } from '../context';

export default function useCommand(): ArteryEngine.CommandNameRunnerMap {
  const engineStore$ = useEngineStoreContext();
  const { useCommandState } = useObservable(engineStore$, {});

  return useCommandState?.commandNameRunnerMap ?? {};
}
