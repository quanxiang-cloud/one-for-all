import { useEffect, useState } from 'react';
import { combineLatest, map, Observable, skip } from 'rxjs';

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
): Record<string, any> {
  return Object.entries(result).map(([propName, propValue]) => {
    const adapter = adapters[propName];
    if (!adapter) {
      return [propName, propValue.data];
    }

    return [
      propName,
      // TODO: handle convert error case
      adapter(propValue),
    ];
  }).reduce<Record<string, any>>((res, [propName, value]) => {
    res[propName] = value;
    return res;
  }, {});
}

function useAPIStateDerivedProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const adapters: Record<string, APIStateConvertor | undefined> = {};
  const resList$: Record<string, Observable<APIState>> = {};
  const fallbacks: Record<string, any> = {};

  Object.entries(node.props).filter((pair): pair is [string, APIDerivedProperty<Instantiated>] => {
    return pair[1].type === NodePropType.APIDerivedProperty;
  }).forEach(([propName, { fallback, adapter, stateID }]) => {
    fallbacks[propName] = fallback;
    adapters[propName] = adapter;
    resList$[propName] = ctx.apiStates.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(fallbacks);

  useEffect(() => {
    if (!Object.keys(resList$).length) {
      return;
    }

    const subscription = combineLatest(resList$).pipe(
      skip(1),
      map((result) => {
        return Object.entries(result).reduce<Record<string, any>>((acc, [key, state]) => {
          state.data = state.data ?? fallbacks[key];
          acc[key] = state;

          return acc;
        }, {});
      }),
      map((result) => convertResult(result, adapters)),
    ).subscribe(setState);

    // todo remove state from stateHub when last subscriber unsubscribed
    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPIStateDerivedProps;
