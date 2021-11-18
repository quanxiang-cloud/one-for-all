import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, map, skip } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  APIDerivedProperty,
  APIState,
  APIStateConvertor,
  NodePropType,
  CTX,
  Instantiated,
  SchemaNode,
} from '../types';

function convertResult(
  result: Record<string, APIState>,
  adapters: Record<string, APIStateConvertor | undefined>,
  fallbacks: Record<string, any>,
): Record<string, any> {
  return Object.entries(result).reduce<Record<string, any>>((acc, [key, state]) => {
    if (typeof adapters[key] === 'function') {
      try {
        const v = adapters[key]?.(state) ?? fallbacks[key];
        acc[key] = v;
      } catch (error) {
        logger.error('failed to run adapter:\n', adapters[key]?.toString(), '\n', error);
        acc[key] = fallbacks[key];
      }

      return acc;
    }

    acc[key] = state.data ?? fallbacks[key];
    return acc;
  }, {});
}

function useAPIStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, APIStateConvertor | undefined> = {};
  const resList$: Record<string, BehaviorSubject<APIState>> = {};
  const fallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, APIDerivedProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIDerivedProperty;
  }).forEach(([propName, { fallback, adapter, stateID }]) => {
    fallbacks[propName] = fallback;
    adapters[propName] = adapter;
    resList$[propName] = ctx.apiStates.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(() => {
    const currentStates = Object.entries(resList$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue();
      return acc;
    }, {});

    return convertResult(currentStates, adapters, fallbacks);
  });

  useEffect(() => {
    const subscription = combineLatest(resList$).pipe(
      skip(1),
      map((result) => convertResult(result, adapters, fallbacks)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPIStateProps;
