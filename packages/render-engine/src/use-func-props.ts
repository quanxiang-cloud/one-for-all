import { useMemo } from 'react';
import { CTX, FunctionalProperty, Instantiated, VersatileFunc } from './types';

type Props = {
  props: Record<string, FunctionalProperty<Instantiated>>;
  ctx: CTX;
}

export function useFuncProps({ props, ctx }: Props): Record<string, VersatileFunc> {
  return useMemo(() => {
    return Object.entries(props).reduce<Record<string, VersatileFunc>>((acc, [key, { func }]) => {
      // just binding execution context is enough
      // todo move this to instantiateFuncSpec
      acc[key] = func.bind(ctx);

      return acc;
    }, {});
  }, []);
}
