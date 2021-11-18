import { useState, useEffect, useRef } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, skip, tap } from 'rxjs';

import {
  CTX,
  Instantiated,
  VersatileFunc,
  SharedStateProperty,
  NodePropType,
  SchemaNode,
} from '../types';
import { convertResult } from './use-api-result-props';

function useSharedStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, VersatileFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  const initialFallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, SharedStateProperty<Instantiated>] => {
    return pair[1].type === NodePropType.SharedStateProperty;
  }).forEach(([key, propSpec]) => {
    states$[key] = ctx.sharedStates.getState$(propSpec.stateID);
    adapters[key] = propSpec.adapter;
    initialFallbacks[key] = propSpec.fallback;
  });

  const fallbacksRef = useRef<Record<string, any>>(initialFallbacks);

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = convertResult({
        result: state$.getValue(),
        adapter: adapters[key],
        fallback: fallbacksRef.current[key],
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(
        skip(1),
        distinctUntilChanged(),
        map((result) => {
          return convertResult({
            result: result,
            adapter: adapters[key],
            fallback: fallbacksRef.current[key],
          });
        }),
        tap((result) => fallbacksRef.current[key] = result),
      );

      return acc;
    }, {});

    const subscription = combineLatest(results$).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useSharedStateProps;
