import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, map, Observable, skip } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  APIResultProperty,
  APIState,
  APIResultConvertor,
  NodePropType,
  CTX,
  Instantiated,
  SchemaNode,
} from '../types';

function convertResult(
  results: Record<string, any>,
  adapters: Record<string, APIResultConvertor | undefined>,
  fallbacks: Record<string, any>,
): Record<string, any> {
  return Object.entries(results).reduce<Record<string, any>>((acc, [key, result]) => {
    if (typeof adapters[key] === 'function' && typeof result !== 'undefined') {
      try {
        const v = adapters[key]?.(result) ?? fallbacks[key];
        acc[key] = v;
      } catch (error) {
        logger.error('failed to run adapter:\n', adapters[key]?.toString(), '\n', error);
        acc[key] = fallbacks[key];
      }

      return acc;
    }

    acc[key] = result ?? fallbacks[key];
    return acc;
  }, {});
}

function useAPIResultProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, APIResultConvertor | undefined> = {};
  const states$: Record<string, BehaviorSubject<APIState>> = {};
  const fallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, APIResultProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIResultProperty;
  }).forEach(([propName, { fallback, adapter, stateID }]) => {
    fallbacks[propName] = fallback;
    adapters[propName] = adapter;
    states$[propName] = ctx.apiStates.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(() => {
    const currentResults = Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue().data;
      return acc;
    }, {});

    return convertResult(currentResults, adapters, fallbacks);
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(skip(1), distinctUntilKeyChanged('data'));
      return acc;
    }, {});

    const subscription = combineLatest(results$).pipe(
      map((results) => convertResult(results, adapters, fallbacks)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPIResultProps;
