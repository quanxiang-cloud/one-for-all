import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, map, Observable, skip } from 'rxjs';

import {
  APIState,
  NodePropType,
  CTX,
  Instantiated,
  SchemaNode,
  APILoadingProperty,
} from '../types';

function useAPILoadingProps(node: SchemaNode<Instantiated>, ctx: CTX): Record<string, any> {
  const states$: Record<string, BehaviorSubject<APIState>> = {};

  Object.entries(node.props).filter((pair): pair is [string, APILoadingProperty] => {
    return pair[1].type === NodePropType.APILoadingProperty;
  }).forEach(([propName, { stateID }]) => {
    states$[propName] = ctx.apiStates.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(() => {
    return Object.entries(states$).reduce<Record<string, any>>((acc, [key, state$]) => {
      acc[key] = state$.getValue().loading;

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<any>>>((acc, [key, state$]) => {
      acc[key] = state$.pipe(
        skip(1),
        distinctUntilKeyChanged('loading'),
        map(({ loading }) => loading),
      );

      return acc;
    }, {});

    const subscription = combineLatest(results$).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPILoadingProps;
