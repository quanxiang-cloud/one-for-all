import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, combineLatest, map, Observable, of, skip, tap } from 'rxjs';

import { CTX, InheritedProperty, SchemaNode, StateConvertor } from '../types';
import { convertState } from './utils';

function useInheritedProps(node: SchemaNode, ctx: CTX): Record<string, unknown> {

  const convertors: Record<string, StateConvertor | undefined> = {};
  const states$: Record<string, BehaviorSubject<Record<string, unknown>> | undefined> = {};
  const initialFallbacks: Record<string, unknown> = {};

  Object.entries(node.props || {})
    .filter((pair): pair is [string, InheritedProperty] => {
      return pair[1].type === 'inherited_property';
    })
    .forEach(([propName, { fallback, convertor, parentID }]) => {
      initialFallbacks[propName] = fallback;
      convertors[propName] = convertor;
      states$[propName] = ctx.nodePropsCache?.getProps$(parentID);
    });

  const fallbacksRef = useRef<Record<string, unknown>>(initialFallbacks);

  const [state, setState] = useState<Record<string, unknown>>(() => {
    return Object.entries(states$).reduce<Record<string, unknown>>((acc, [key, state$]) => {
      if (!state$) {
        acc[key] = fallbacksRef.current[key];
        return acc;
      }

      acc[key] = convertState({
        state: state$?.getValue(),
        convertor: convertors[key],
        fallback: fallbacksRef.current[key],
        propName: key,
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const inheritProps$ = Object.entries(states$).reduce<Record<string, Observable<unknown>>>(
      (acc, [key, state$]) => {
        if (!state$) {
          acc[key] = of(fallbacksRef.current[key]);
          return acc;
        }

        acc[key] = state$.pipe(
          map((nodeProps) => {
            return convertState({
              state: nodeProps,
              convertor: convertors[key],
              fallback: fallbacksRef.current[key],
              propName: key,
            });
          }),
          tap((convertedProps) => (fallbacksRef.current[key] = convertedProps)),
        );

        return acc;
      },
      {},
    );

    const subscription = combineLatest(inheritProps$).pipe(skip(1)).subscribe(setState);

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export default useInheritedProps;
