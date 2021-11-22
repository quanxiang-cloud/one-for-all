import { useState, useEffect, useRef } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, skip, tap } from 'rxjs';
import { NodeStateProperty } from '..';

import {
  CTX,
  Instantiated,
  VersatileFunc,
  SharedStateProperty,
  NodePropType,
  SchemaNode,
} from '../types';
import convertState from './convert-state';

type Pair = [string, SharedStateProperty<Instantiated> | NodeStateProperty<Instantiated>];

function useSharedStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, VersatileFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  const initialFallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is Pair => {
    return pair[1].type === NodePropType.SharedStateProperty ||
      pair[1].type === NodePropType.NodeStateProperty;
  }).forEach(([key, propSpec]) => {
    if (propSpec.type === NodePropType.SharedStateProperty) {
      states$[key] = ctx.statesHubShared.getState$(propSpec.stateID);
      adapters[key] = propSpec.convertor;
    } else {
      states$[key] = ctx.statesHubShared.getNodeState$(propSpec.nodeKey);
      adapters[key] = propSpec.convertor;
    }

    initialFallbacks[key] = propSpec.fallback;
  });

  const fallbacksRef = useRef<Record<string, any>>(initialFallbacks);

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = convertState({
        state: state$.getValue(),
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
        distinctUntilChanged(),
        map((result) => {
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

    const subscription = combineLatest(results$).pipe(skip(1)).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useSharedStateProps;
