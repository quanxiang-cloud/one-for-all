import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, skip } from 'rxjs';

import {
  CTX,
  SchemaNode,
  Instantiated,
  NodePropType,
  ComputedProperty,
} from '../types';
import { getComputedState$ } from './utils';

export default function useComputedProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, unknown> {
  const states$: Record<string, BehaviorSubject<unknown>> = {};

  Object.entries(node.props || {}).filter((pair): pair is [string, ComputedProperty<Instantiated>] => {
    return pair[1].type === NodePropType.ComputedProperty;
  }).forEach(([propName, { deps, convertor, fallback }]) => {
    states$[propName] = getComputedState$({ propName, deps, convertor, ctx, fallback });
  });

  const [states, setStates] = useState<Record<string, unknown>>(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      acc[key] = state$.value;

      return acc;
    }, {});
  });

  useEffect(() => {
    const subscriptions = combineLatest(states$).pipe(
      skip(1),
    ).subscribe(setStates);

    return () => subscriptions.unsubscribe();
  }, []);

  return states;
}
