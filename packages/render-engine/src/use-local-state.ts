import { Subject } from 'rxjs';
import { useObservableState } from 'observable-hooks';

export type SetState<T> = (state: T) => void;
type LocalStore<T> = Record<string, [Subject<T>, SetState<T>]>;

const localStore: LocalStore<any> = {};

function createLocalStream<T>(): [Subject<T>, SetState<T>] {
  const state$ = new Subject<T>();
  function updater(state: T): void {
    state$.next(state);
  }

  return [state$, updater];
}

function getLocalStateStream<T>(key: string): [Subject<T>, SetState<T>] {
  if (!localStore[key]) {
    localStore[key] = createLocalStream();
  }

  return localStore[key];
}

function useLocalState<T>(key: string, defaultState?: T): [T | undefined, SetState<T>] {
  const [state$, updater] = getLocalStateStream<T>(key);

  return [useObservableState(state$), updater];
}

export default useLocalState;
