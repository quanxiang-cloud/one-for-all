import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, map, Observable, skip, tap } from 'rxjs';

import {
  APIResultProperty,
  APIState,
  Adapter,
  NodePropType,
  CTX,
  Instantiated,
  SchemaNode,
} from '../types';
import convertResult from './convert-result';

function useAPIResultProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, Adapter | undefined> = {};
  const states$: Record<string, BehaviorSubject<APIState>> = {};
  const initialFallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, APIResultProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIResultProperty;
  }).forEach(([propName, { fallback, adapter, stateID }]) => {
    initialFallbacks[propName] = fallback;
    adapters[propName] = adapter;
    states$[propName] = ctx.apiStates.getState(stateID);
  });

  const fallbacksRef = useRef<Record<string, any>>(initialFallbacks);

  const [state, setState] = useState<Record<string, any>>(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = convertResult({
        result: state$.getValue().data,
        adapter: adapters[key],
        fallback: fallbacksRef.current[key],
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(
        distinctUntilKeyChanged('data'),
        map(({ data }) => {
          return convertResult({
            result: data,
            adapter: adapters[key],
            fallback: fallbacksRef.current[key],
          });
        }),
        tap((result) => fallbacksRef.current[key] = result),
      );

      return acc;
    }, {});

    const subscription = combineLatest(results$).pipe(skip(1)).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPIResultProps;
