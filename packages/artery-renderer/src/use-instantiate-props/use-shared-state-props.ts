import { useState, useEffect, useRef } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, skip, tap } from 'rxjs';

import { CTX, SharedStateProperty, NodeStateProperty, ArteryNode, StateConvertor } from '../types';
import { convertState } from './utils';

type Pair = [string, SharedStateProperty | NodeStateProperty];

function useSharedStateProps(node: ArteryNode, ctx: CTX): Record<string, unknown> {
  const convertors: Record<string, StateConvertor | undefined> = {};
  const states$: Record<string, BehaviorSubject<unknown>> = {};
  const initialFallbacks: Record<string, unknown> = {};

  Object.entries(node.props || {})
    .filter((pair): pair is Pair => {
      return pair[1].type === 'shared_state_property' || pair[1].type === 'node_state_property';
    })
    .forEach(([key, propSpec]) => {
      if (propSpec.type === 'shared_state_property') {
        states$[key] = ctx.statesHubShared.getState$(propSpec.stateID);
        convertors[key] = propSpec.convertor;
      } else {
        states$[key] = ctx.statesHubShared.getNodeState$(propSpec.nodePath);
        convertors[key] = propSpec.convertor;
      }

      initialFallbacks[key] = propSpec.fallback;
    });

  const fallbacksRef = useRef<Record<string, unknown>>(initialFallbacks);

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      acc[key] = convertState({
        state: state$.getValue(),
        convertor: convertors[key],
        fallback: fallbacksRef.current[key],
        propName: key,
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    if (!Object.keys(states$).length) {
      return;
    }

    const results$ = Object.entries(states$).reduce<Record<string, Observable<unknown>>>(
      (acc, [key, state$]) => {
        acc[key] = state$.pipe(
          distinctUntilChanged(),
          map((result) => {
            return convertState({
              state: result,
              convertor: convertors[key],
              fallback: fallbacksRef.current[key],
              propName: key,
            });
          }),
          tap((result) => {
            fallbacksRef.current[key] = result;
          }),
        );

        return acc;
      },
      {},
    );

    const subscription = combineLatest(results$).pipe(skip(1)).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useSharedStateProps;
