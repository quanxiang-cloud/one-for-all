import { useEffect, useState } from 'react';
import { combineLatest, Observable } from 'rxjs';

import APIStream from './api-stream';
import { APIDerivedProperty } from './types';

type UseAPIProps = {
  props: Record<string, APIDerivedProperty>;
  apiStream: APIStream;
}

export default function useAPIDerivedProps({ props, apiStream }: UseAPIProps): Record<string, unknown> {
  const initialResult = Object.entries(props).reduce<Record<string, unknown>>(
    (initialResult, [propName, { initialValue }]) => {
      initialResult[propName] = initialValue;
      return initialResult;
    }, {});

  const resList$ = Object.entries(props)
    .map<[string, Observable<unknown>]>(([propName, { streamID, convertor }]) => {
      return [propName, apiStream.getValue(streamID, convertor)];
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
