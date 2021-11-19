import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, map, Observable, skip, tap } from 'rxjs';

import {
  APIResultProperty,
  APIState,
  StateConvertorFunc,
  NodePropType,
  CTX,
  Instantiated,
  SchemaNode,
} from '../types';
import convertState from './convert-state';

function useAPIResultProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, StateConvertorFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<APIState>> = {};
  const initialFallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, APIResultProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIResultProperty;
  }).forEach(([propName, { fallback, convertor: adapter, stateID }]) => {
    initialFallbacks[propName] = fallback;
    adapters[propName] = adapter;
    states$[propName] = ctx.apiStates.getState(stateID);
  });

  const fallbacksRef = useRef<Record<string, any>>(initialFallbacks);

  const [state, setState] = useState<Record<string, any>>(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = convertState({
        state: state$.getValue().data,
        convertor: adapters[key],
        fallback: fallbacksRef.current[key],
        propName: key,
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(
        distinctUntilKeyChanged('data'),
        map(({ data }) => {
          return convertState({
            state: data,
            convertor: adapters[key],
            fallback: fallbacksRef.current[key],
            propName: key,
          });
        }),
        tap((result) => fallbacksRef.current[key] = result),
      );

      return acc;
    }, {});

    const subscription = combineLatest(results$).pipe(
      skip(1),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPIResultProps;
