import { APISpecAdapter, FetchParams } from '@one-for-all/api-spec-adapter';
import { combineLatest, firstValueFrom, from, last, map, Observable, of, switchMap, take } from 'rxjs';
import { logger } from '@one-for-all/utils';

import { APIStatesSpec, SharedStatesSpec, InitializerFunc } from '../types';
import initAPIState from './init-api-state';

interface LazyState {
  stateID: string;
  func: InitializerFunc;
  dependencies?: {
    [key: string]: FetchParams;
  };
}

function toDependency$(
  apiSpecAdapter: APISpecAdapter,
  apiID: string,
  params: FetchParams,
): Observable<unknown> {
  const { state$, fetch } = initAPIState(apiID, apiSpecAdapter);

  // we only need the api result
  const dependency$ = state$.pipe(
    // loading, resolved
    take(2),
    last(),
    map(({ result }) => result),
  );

  fetch({ params });

  return dependency$;
}

function toDeps$(
  deps: Record<string, FetchParams>,
  apiStates: APIStatesSpec,
  apiSpecAdapter: APISpecAdapter,
): Observable<Record<string, unknown>> {
  const dependencies$ = Object.entries(deps)
    .map(([stateID, fetchParams]) => {
      if (!apiStates[stateID]) {
        logger.error(
          `no state: ${stateID} found in APIStatesSpec, undefined will be used as this dependency value`,
        );
        return undefined;
      }

      const { apiID } = apiStates[stateID];

      return [stateID, toDependency$(apiSpecAdapter, apiID, fetchParams)];
    })
    .filter((pair): pair is [string, Observable<unknown>] => !!pair)
    .reduce<Record<string, Observable<unknown>>>((acc, [stateID, dependency$]) => {
      acc[stateID] = dependency$;
      return acc;
    }, {});

  if (!Object.keys(dependencies$).length) {
    return of({});
  }

  return combineLatest(dependencies$);
}

function promisify(func: InitializerFunc): (p: Record<string, unknown>) => Promise<unknown> {
  return (p: Record<string, unknown>) => {
    return Promise.resolve(
      (() => {
        try {
          return func(p);
        } catch (error) {
          return undefined;
        }
      })(),
    );
  };
}

function toObservableMap(
  lazyStates: LazyState[],
  apiStateSpec: APIStatesSpec,
  apiSpecAdapter: APISpecAdapter,
): Record<string, Observable<unknown>> {
  return lazyStates
    .map<[string, Observable<unknown>]>(({ stateID, func, dependencies }) => {
      const deps$ = toDeps$(dependencies || {}, apiStateSpec, apiSpecAdapter);
      const state$ = deps$.pipe(
        switchMap((deps) => {
          return from(promisify(func)(deps));
        }),
      );

      return [stateID, state$];
    })
    .reduce<Record<string, Observable<unknown>>>((acc, [stateID, state$]) => {
      acc[stateID] = state$;

      return acc;
    }, {});
}

/**
 * filterLazyStates return a list of state which required lazy initialization
 * @param sharedStateSpec - SharedStatesSpec
 */
function filterLazyStates(sharedStateSpec: SharedStatesSpec): Array<LazyState> {
  return Object.entries(sharedStateSpec)
    .map(([stateID, { initializer }]) => {
      if (initializer) {
        return { ...initializer, stateID };
      }

      return;
    })
    .filter((lazyState): lazyState is LazyState => !!lazyState);
}

/**
 * initializeLazyStates will wait for all the dependencies to be resolved,
 * then call the initialize function, then return the finial shared states.
 * @param sharedStateSpec - the original sharedStateSpec
 * @param apiStateSpec - APIStatesSpec in schema
 * @param apiSpecAdapter - APISpecAdapter plugin
 * @returns initialized shared states
 */
async function initializeLazyStates(
  sharedStateSpec: SharedStatesSpec,
  apiStateSpec: APIStatesSpec,
  apiSpecAdapter?: APISpecAdapter,
): Promise<SharedStatesSpec> {
  if (!apiSpecAdapter) {
    return sharedStateSpec;
  }

  const lazyStates = filterLazyStates(sharedStateSpec);
  // turn lazy states to observables
  const obsStateMap = toObservableMap(lazyStates, apiStateSpec, apiSpecAdapter);
  if (!Object.keys(obsStateMap).length) {
    return sharedStateSpec;
  }

  // wait for all the observables emit value
  const lazyStatesMap = await firstValueFrom(combineLatest(obsStateMap));

  // merge with original states
  Object.entries(lazyStatesMap).forEach(([stateID, value]) => {
    sharedStateSpec[stateID].initial = value;
  });

  return sharedStateSpec;
}

export default initializeLazyStates;
