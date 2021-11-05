import { useState, useEffect, useMemo } from 'react';
import { BehaviorSubject, skip } from 'rxjs';

const localStateCache: Record<string, BehaviorSubject<any>> = {};

function getLocalStateStream<T>(key: string): BehaviorSubject<any> {
  if (!localStateCache[key]) {
    localStateCache[key] = new BehaviorSubject(undefined);
  }

  return localStateCache[key];
}

export function useLocalState<T>(key: string, initialValue?: T): T {
  const localState$ = getLocalStateStream<T>(key);
  const [value, setValue] = useState<T>(localState$.getValue() ?? initialValue);

  useEffect(() => {
    const subscription = localState$.pipe(skip(1)).subscribe(setValue);

    return () => subscription.unsubscribe();
  }, []);

  return value;
}

export function useSetLocalState<T>(key: string): (value: any) => void {
  return useMemo(() => {
    const localState$ = getLocalStateStream<T>(key);

    return (value: any) => localState$.next(value);
  }, []);
}
