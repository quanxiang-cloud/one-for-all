import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, skip, tap } from 'rxjs';

import {
  CTX,
  NodePropType,
  Instantiated,
  StateConvertorFunc,
  NodeStateProperty,
  SchemaNode,
} from '../types';
import convertState from './convert-state';

function useNodeStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, StateConvertorFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  const initialFallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, NodeStateProperty<Instantiated>] => {
    return pair[1].type === NodePropType.NodeStateProperty;
  }).forEach(([key, propSpec]) => {
    states$[key] = ctx.sharedStates.getNodeState$(propSpec.nodeKey);
    adapters[key] = propSpec.convertor;
    initialFallbacks[key] = propSpec.fallback;
  });

  const fallbacksRef = useRef<Record<string, any>>(initialFallbacks);

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = convertState({
        state: state$.getValue(),
        convertor: adapters[key],
        fallback: fallbacksRef.current[key],
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(
        distinctUntilChanged(),
        map((result) => {
          return convertState({
            state: result,
            convertor: adapters[key],
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

export default useNodeStateProps;
