import { useState, useEffect, useMemo } from 'react';
import { BehaviorSubject, combineLatest, skip } from 'rxjs';
import { APIStateContext, CTX, Instantiated, LocalStateContext, LocalStateConvertFunc, LocalStateProperty } from './types';

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

export class LocalStateHub implements LocalStateContext {
  cache: Record<string, BehaviorSubject<any>> = {};
  ctx: CTX | null = null;

  initContext(apiStateContext: APIStateContext): void {
    this.ctx = {
      apiStateContext: apiStateContext,
      localStateContext: this,
    };
  }

  getState(stateID: string): BehaviorSubject<any> {
    if (!this.cache[stateID]) {
      this.cache[stateID] = new BehaviorSubject(undefined);
    }

    return this.cache[stateID];
  }
}

function convertResult(
  result: Record<string, any>,
  convertor: Record<string, LocalStateConvertFunc | undefined>,
  ctx: CTX,
): Record<string, any> {
  return Object.entries(result).reduce<Record<string, any>>((acc, [key, value]) => {
    const convertedValue = typeof convertor[key] === 'function' ? convertor[key]?.({ data: value, ctx }) : value;

    return acc[key] = convertedValue;
  }, {});
}

type UseLocalStateProps = {
  props: Record<string, LocalStateProperty<Instantiated>>;
  stateHub: LocalStateHub;
  apiStateContext: APIStateContext;
}

export function useLocalStateProps({ props, stateHub, apiStateContext }: UseLocalStateProps): Record<string, any> {
  const state$ = Object.entries(props).reduce<Record<string, BehaviorSubject<any>>>((acc, [key, propSpec]) => {
    acc[key] = stateHub.getState(propSpec.stateID);
    return acc;
  }, {});

  const [state, setState] = useState(() => {
    return Object.entries(props).reduce<Record<string, any>>((acc, [key, propSpec]) => {
      const initialValue = stateHub.getState(propSpec.stateID).getValue() ?? propSpec.initialValue;
      return acc[key] = initialValue;
    }, {});
  });

  useEffect(() => {
    const subscription = combineLatest(state$).pipe(
      skip(1),
      // map((result) => convertResult(result, mappers, stateHub)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
