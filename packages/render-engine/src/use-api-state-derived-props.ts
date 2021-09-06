import { useEffect, useState } from 'react';
import { combineLatest, map, Observable, skip } from 'rxjs';

import StateHub from './state-hub';
import { APIDerivedProperty, Instantiated, APIStateMapperFunc } from './types';

type UseAPIProps = {
  props: Record<string, APIDerivedProperty<Instantiated>>;
  stateHub: StateHub;
}

function convertResult(
  result: Record<string, any>,
  convertors: Record<string, APIStateMapperFunc | undefined>,
): Record<string, any> {
  return Object.entries(result).map(([propName, propValue]) => {
    return [
      propName,
      // TODO: handle convert error case
      convertors[propName] ? convertors[propName]?.(propValue) : propValue,
    ];
  }).reduce<Record<string, any>>((res, [propName, value]) => {
    res[propName] = value;
    return res;
  }, {});
}

export default function useAPIStateDerivedProps({ props, stateHub }: UseAPIProps): Record<string, any> {
  const initialState: Record<string, any> = {};
  const mappers: Record<string, APIStateMapperFunc | undefined> = {};
  const resList$: Record<string, Observable<any>> = {};

  Object.entries(props).forEach(([propName, { initialValue, mapper, stateID }]) => {
    initialState[propName] = initialValue;
    mappers[propName] = mapper;
    resList$[propName] = stateHub.getState(stateID);
  });

  const [state, setState] = useState<Record<string, any>>(initialState);

  useEffect(() => {
    const subscription = combineLatest(resList$).pipe(
      skip(1),
      map((result) => convertResult(result, mappers)),
    ).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
