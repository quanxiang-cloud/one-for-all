import { useEffect, useState } from 'react';
import { combineLatest, Observable } from 'rxjs';

import QueryResult from './use-query';
import { APIDerivedProperty } from './types';

type UseAPIProps = {
  props: Array<{ propsName: string } & APIDerivedProperty>;
  queryResult: QueryResult;
}

export default function useAPIDerivedProps({ props, queryResult }: UseAPIProps): Record<string, unknown> {
  const initialResult: Record<string, unknown> = props.reduce((acc, { propsName, initialValue }) => {
    acc[propsName] = initialValue;
    return acc;
  }, {} as Record<string, unknown>);
  const [result, setResult] = useState<Record<string, unknown>>(initialResult);
  const resList$ = props.map<[string, Observable<any>]>(({ streamID, convertor, propsName }) => {
    return [propsName, queryResult.getValue(streamID, convertor)];
  }).reduce<Record<string, Observable<any>>>((acc, [propsName, res$]) => {
    acc[propsName] = res$;
    return acc;
  }, {});

  useEffect(() => {
    const subscription = combineLatest(resList$).subscribe((res) => {
      setResult(res);
    });

    return subscription.unsubscribe();
  }, []);

  return result;
}
