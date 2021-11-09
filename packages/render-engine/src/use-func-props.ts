import { useMemo } from 'react';
import { FunctionalProperty, Instantiated, VersatileFunc } from './types';

type Props = {
  props: Record<string, FunctionalProperty<Instantiated>>;
}

export function useFuncProps({ props }: Props): Record<string, VersatileFunc> {
  return useMemo(() => {
    return Object.entries(props).reduce<Record<string, VersatileFunc>>((acc, [key, { func }]) => {
      acc[key] = func;

      return acc;
    }, {});
  }, []);
}
