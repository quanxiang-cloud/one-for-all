import { BehaviorSubject, map, skip, tap, combineLatest } from 'rxjs';
import { logger } from '@one-for-all/utils';
import type { ComputedDependency } from '@one-for-all/artery';

import { CTX, StateConvertor } from '../types';

interface ConvertResultParams {
  state: unknown;
  convertor?: StateConvertor;
  fallback: unknown;
  propName: string;
}

export function convertState({ state, convertor, fallback, propName }: ConvertResultParams): unknown {
  if (convertor && state !== undefined) {
    try {
      return convertor(state) ?? fallback;
    } catch (error) {
      logger.error(
        `an error occurred while calling state convertor for prop: "${propName}"`,
        'with the following state and convertor:',
        '\n',
        state,
        '\n',
        convertor.toString(),
        '\n',
        'So return fallback instead, fallback:',
        fallback,
        '\n',
        '\n',
        error,
      );
      return fallback;
    }
  }

  return state ?? fallback;
}

interface GetComputedState$Props {
  propName: string;
  deps: ComputedDependency[];
  convertor: StateConvertor;
  ctx: CTX;
  fallback: unknown;
}

export function getComputedState$({
  propName,
  deps,
  convertor,
  ctx,
  fallback,
}: GetComputedState$Props): BehaviorSubject<unknown> {
  let _fallback = fallback;
  const deps$ = deps.map<BehaviorSubject<unknown>>(({ type, depID }) => {
    if (type === 'api_state') {
      return ctx.statesHubAPI.getState$(depID) as BehaviorSubject<unknown>;
    }

    if (type === 'node_state') {
      return ctx.statesHubShared.getNodeState$(depID);
    }

    return ctx.statesHubShared.getState$(depID);
  });
  const initialDeps = deps$.reduce((acc: Record<string, unknown>, dep$, index) => {
    return {
      ...acc,
      [deps[index].depID]: dep$.value,
    };
  }, {});
  const state$ = new BehaviorSubject(
    convertState({
      state: initialDeps,
      convertor: convertor,
      fallback: fallback,
      propName,
    }),
  );

  combineLatest(deps$)
    .pipe(
      map((_deps) => {
        const updatedDeps = _deps.reduce((acc: Record<string, unknown>, _dep, index) => {
          return {
            ...acc,
            [deps[index].depID]: _dep,
          };
        }, {});
        return convertState({
          state: updatedDeps,
          convertor: convertor,
          fallback: _fallback,
          propName,
        });
      }),
      skip(1),
      tap((state) => {
        _fallback = state;
      }),
    )
    .subscribe((state) => state$.next(state));

  return state$;
}
