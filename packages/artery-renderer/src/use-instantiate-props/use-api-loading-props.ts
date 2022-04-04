import { useEffect, useState } from 'react';
import { BehaviorSubject, combineLatest, distinctUntilKeyChanged, map, Observable, skip } from 'rxjs';
import type { APILoadingProperty } from '@one-for-all/artery';

import { APIState, CTX, ArteryNode } from '../types';

function useAPILoadingProps(node: ArteryNode, ctx: CTX): Record<string, unknown> {
  const states$: Record<string, BehaviorSubject<APIState>> = {};

  Object.entries(node.props || {})
    .filter((pair): pair is [string, APILoadingProperty] => {
      return pair[1].type === 'api_loading_property';
    })
    .forEach(([propName, { stateID }]) => {
      states$[propName] = ctx.statesHubAPI.getState$(stateID);
    });

  const [state, setState] = useState<Record<string, unknown>>(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      acc[key] = state$.getValue().loading;

      return acc;
    }, {});
  });

  useEffect(() => {
    const results$ = Object.entries(states$).reduce<Record<string, Observable<unknown>>>(
      (acc, [key, state$]) => {
        acc[key] = state$.pipe(
          skip(1),
          distinctUntilKeyChanged('loading'),
          map(({ loading }) => loading),
        );

        return acc;
      },
      {},
    );

    const subscription = combineLatest(results$).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useAPILoadingProps;
