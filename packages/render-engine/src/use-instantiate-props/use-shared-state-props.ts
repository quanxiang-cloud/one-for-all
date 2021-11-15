import { useState, useEffect } from 'react';
import { BehaviorSubject, combineLatest, map, skip } from 'rxjs';

import {
  CTX,
  Instantiated,
  RawDataConvertor,
  SharedStateProperty,
  NodePropType,
  SchemaNode,
} from '../types';
import { convertResult } from './use-node-state-props';

function useSharedStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, RawDataConvertor | undefined> = {};
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
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      // todo fallback
      acc[key] = state$.getValue();
      return acc;
    }, {});
  });

  useEffect(() => {
    const subscription = combineLatest(states$).pipe(
      skip(1),
      map((result) => convertResult(result, adapters, ctx, fallbacks)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useSharedStateProps;
