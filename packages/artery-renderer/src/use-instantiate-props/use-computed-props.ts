import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, skip } from 'rxjs';

import { ArteryNode, ComputedProperty } from '../types';
import useCTX from '../use-ctx';
import { getComputedState$ } from './utils';

export default function useComputedProps(node: ArteryNode): Record<string, unknown> {
  const ctx = useCTX();
  const states$: Record<string, BehaviorSubject<unknown>> = {};

  Object.entries(node.props || {})
    .filter((pair): pair is [string, ComputedProperty] => {
      return pair[1].type === 'computed_property';
    })
    .forEach(([propName, { deps, convertor, fallback }]) => {
      states$[propName] = getComputedState$({ propName, deps, convertor, ctx, fallback });
    });

  const [states, setStates] = useState<Record<string, unknown>>(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      acc[key] = state$.value;

      return acc;
    }, {});
  });

  useEffect(() => {
    const subscriptions = combineLatest(states$).pipe(skip(1)).subscribe(setStates);

    return () => subscriptions.unsubscribe();
  }, []);

  return states;
}
