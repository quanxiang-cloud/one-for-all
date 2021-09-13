import { useState, useEffect } from 'react';
import { Subject } from 'rxjs';

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
  const [state, setState] = useState<T | undefined>(defaultState);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [updater, setUpdater] = useState<SetState<T>>(() => {});

  useEffect(() => {
    const [state$, updater] = getLocalStateStream<T>(key);
    setUpdater(updater);
    const subscription = state$.subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return [state, updater];
}

export default useLocalState;
