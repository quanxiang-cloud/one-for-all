import { Subject } from 'rxjs';
import { useObservableState } from 'observable-hooks';

export type SetState<T> = (state: T) => void;
type LocalStore<T> = Record<string, [Subject<T>, SetState<T>]>;

const localStore: LocalStore<any> = {};

function createLocalStateStream<T>(key: string): [Subject<T>, SetState<T>] {
  if (!localStore[key]) {
    const state$ = new Subject<T>();
    function updater(state: T) {
      state$.next(state);
    }
    localStore[key] = [state$, updater];
  }

  return localStore[key];
}

function useLocalState<T>(key: string, defaultState?: T): [T | undefined, SetState<T>] {
  const [state$, updater] = createLocalStateStream<T>(key);

  return [useObservableState(state$), updater];
}

export default useLocalState;
