import { useState, useEffect } from 'react';
import { BehaviorSubject, combineLatest, map, skip } from 'rxjs';

import {
  CTX,
  Instantiated,
  VersatileFunc,
  SharedStateProperty,
  NodePropType,
  SchemaNode,
} from '../types';
import { convertResult } from './adaptor';

function useSharedStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, VersatileFunc | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  const fallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, SharedStateProperty<Instantiated>] => {
    return pair[1].type === NodePropType.SharedStateProperty;
  }).forEach(([key, propSpec]) => {
    states$[key] = ctx.sharedStates.getState$(propSpec.stateID);
    adapters[key] = propSpec.adapter;
    fallbacks[key] = propSpec.fallback;
  });

  const [state, setState] = useState(() => {
    const currentStates = Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue();
      return acc;
    }, {});

    return convertResult(currentStates, adapters, fallbacks);
  });

  useEffect(() => {
    const subscription = combineLatest(states$).pipe(
      skip(1),
      map((result) => convertResult(result, adapters, fallbacks)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useSharedStateProps;
