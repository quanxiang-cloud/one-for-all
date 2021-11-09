import { useState, useEffect } from 'react';
import { BehaviorSubject, combineLatest, map, skip } from 'rxjs';
import {
  APIStateContext,
  CTX,
  Instantiated,
  LocalStateContext,
  LocalStateConvertFunc,
  LocalStateProperty,
  LocalStateSpec,
  SetLocalStateProperty,
} from './types';

export class LocalStateHub implements LocalStateContext {
  cache: Record<string, BehaviorSubject<any>> = {};
  ctx: CTX | null = null;
  spec: LocalStateSpec;

  constructor(spec: LocalStateSpec) {
    this.spec = spec;
  }

  initContext(apiStateContext: APIStateContext): void {
    this.ctx = {
      apiStateContext: apiStateContext,
      localStateContext: this,
    };
  }

  getState$(stateID: string): BehaviorSubject<any> {
    if (!this.cache[stateID]) {
      this.cache[stateID] = new BehaviorSubject(this.spec[stateID]?.initial);
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
    const convertedValue = typeof convertor[key] === 'function' ?
      convertor[key]?.({ data: value, ctx }) : value;

    acc[key] = convertedValue;
    return acc;
  }, {});
}

type UseLocalStatePropsProps = {
  props: Record<string, LocalStateProperty<Instantiated>>;
  ctx: CTX;
}

export function useLocalStateProps({ props, ctx }: UseLocalStatePropsProps): Record<string, any> {
  const mappers: Record<string, LocalStateConvertFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  Object.entries(props).forEach(([key, propSpec]) => {
    states$[key] = ctx.localStateContext.getState$(propSpec.stateID);
    mappers[key] = propSpec.adapter;
  });

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue();
      return acc;
    }, {});
  });

  useEffect(() => {
    const subscription = combineLatest(states$).pipe(
      skip(1),
      map((result) => convertResult(result, mappers, ctx)),
    // ).subscribe(setState);
    ).subscribe((value) => {
      console.log(value);
      setState(value);
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

type UseSetLocalStateProps = {
  props: Record<string, SetLocalStateProperty<Instantiated>>;
  ctx: CTX;
}

type SetLocalStateFuncProps = Record<string, (value: any) => void>;

export function useSetLocalStateProps({ props, ctx }: UseSetLocalStateProps): SetLocalStateFuncProps {
  const [funcProps] = useState(() => {
    return Object.entries(props).reduce<SetLocalStateFuncProps>((acc, [key, propSpec]) => {
      const state$ = ctx.localStateContext.getState$(propSpec.stateID);
      acc[key] = (value: any) => {
        state$.next(value);
      };

      return acc;
    }, {});
  });

  return funcProps;
}
