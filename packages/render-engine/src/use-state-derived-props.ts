import { useEffect, useState } from 'react';
import { combineLatest, Observable } from 'rxjs';

import StateHub from './state-hub';
import { ResultDerivedProperty } from './types';

type UseAPIProps = {
  props: Record<string, ResultDerivedProperty>;
  stateHub: StateHub;
}

export default function useStateDerivedProps({ props, stateHub }: UseAPIProps): Record<string, unknown> {
  const initialResult = Object.entries(props).reduce<Record<string, unknown>>(
    (initialResult, [propName, { initialValue }]) => {
      initialResult[propName] = initialValue;
      return initialResult;
    }, {});

  const resList$ = Object.entries(props)
    .map<[string, Observable<unknown>]>(([propName, { streamID, convertor }]) => {
      return [propName, stateHub.getValue(streamID, convertor)];
    })
    .reduce<Record<string, Observable<unknown>>>((acc, [propName, res$]) => {
      acc[propName] = res$;
      return acc;
    }, {});

  const [result, setResult] = useState<Record<string, unknown>>(initialResult);

  useEffect(() => {
    const subscription = combineLatest(resList$).subscribe(setResult);

    return subscription.unsubscribe();
  }, []);

  return result;
}
