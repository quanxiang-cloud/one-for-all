import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, map, skip } from 'rxjs';
import { logger } from '@ofa/utils';

import {
  CTX,
  NodePropType,
  Instantiated,
  RawDataConvertor,
  NodeStateProperty,
  SchemaNode,
} from '../types';

export function convertResult(
  result: Record<string, any>,
  adapters: Record<string, RawDataConvertor | undefined>,
  ctx: CTX,
  fallbacks: Record<string, any>,
): Record<string, any> {
  return Object.entries(result).reduce<Record<string, any>>((acc, [key, value]) => {
    let v = value ?? fallbacks[key];
    if (typeof adapters[key] === 'function') {
      try {
        v = adapters[key]?.(value) ?? fallbacks[key];
      } catch (error) {
        logger.error('failed to run adapter', error);
      }
    }

    acc[key] = v;
    return acc;
  }, {});
}

function useNodeStateProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, RawDataConvertor | undefined> = {};
  const states$: Record<string, BehaviorSubject<any>> = {};
  const fallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, NodeStateProperty<Instantiated>] => {
    return pair[1].type === NodePropType.NodeStateProperty;
  }).forEach(([key, propSpec]) => {
    states$[key] = ctx.nodeInternalStates.getState$(propSpec.nodeKey);
    adapters[key] = propSpec.adapter;
    fallbacks[key] = propSpec.fallback;
  });

  const [state, setState] = useState(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue() ?? fallbacks[key];
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

export default useNodeStateProps;
