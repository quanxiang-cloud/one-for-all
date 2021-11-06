import { useEffect, useState } from 'react';
import { combineLatest, map, Observable, skip } from 'rxjs';

import APIStateHub from './api-state-hub';
import { APIDerivedProperty, Instantiated, APIStateConvertFunc, APIState, CTX } from './types';

type UseAPIProps = {
  props: Record<string, APIDerivedProperty<Instantiated>>;
  apiStateHub: APIStateHub;
}

function convertResult(
  result: Record<string, APIState>,
  convertors: Record<string, APIStateConvertFunc | undefined>,
  ctx: CTX,
): Record<string, any> {
  return Object.entries(result).map(([propName, propValue]) => {
    return [
      propName,
      // TODO: handle convert error case
      convertors[propName] ? convertors[propName]?.({ ...propValue, ctx }) : propValue,
    ];
  }).reduce<Record<string, any>>((res, [propName, value]) => {
    res[propName] = value;
    return res;
  }, {});
}

export default function useAPIStateDerivedProps({ props, apiStateHub }: UseAPIProps): Record<string, any> {
  const initialState: Record<string, any> = {};
  const mappers: Record<string, APIStateConvertFunc | undefined> = {};
  const resList$: Record<string, Observable<APIState>> = {};

  Object.entries(props).forEach(([propName, { initialValue, template: mapper, stateID }]) => {
    initialState[propName] = initialValue;
    mappers[propName] = mapper;
    resList$[propName] = apiStateHub.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(initialState);

  useEffect(() => {
    const subscription = combineLatest(resList$).pipe(
      skip(1),
      map((result) => convertResult(result, mappers, apiStateHub.ctx as CTX)),
    ).subscribe(setState);

    // todo remove state from stateHub when last subscriber unsubscribed
    return () => subscription.unsubscribe();
  }, []);

  return state;
}
