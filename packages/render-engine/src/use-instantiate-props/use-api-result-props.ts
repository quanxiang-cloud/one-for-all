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

function useAPIResultProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, unknown> {
  const adapters: Record<string, StateConvertorFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<APIState>> = {};
  const initialFallbacks: Record<string, unknown> = {};

  Object.entries(node.props || {}).filter((pair): pair is [string, APIResultProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIResultProperty;
  }).forEach(([propName, { fallback, convertor: adapter, stateID }]) => {
    initialFallbacks[propName] = fallback;
    adapters[propName] = adapter;
    states$[propName] = ctx.statesHubAPI.getState$(stateID);
  });

  const fallbacksRef = useRef<Record<string, unknown>>(initialFallbacks);

  const [state, setState] = useState<Record<string, unknown>>(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      acc[key] = convertState({
        state: state$.getValue().result,
        convertor: adapters[key],
        fallback: fallbacksRef.current[key],
        propName: key,
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$)
      .reduce<Record<string, Observable<unknown>>>((acc, [key, state$]) => {
        acc[key] = state$.pipe(
          distinctUntilKeyChanged('result'),
          map(({ result }) => {
            return convertState({
              state: result,
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
