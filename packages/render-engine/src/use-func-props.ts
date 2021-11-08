import { useMemo } from 'react';
import { CTX, FunctionalProperty, FunctionProperty, Instantiated } from './types';

type Props = {
  props: Record<string, FunctionProperty<Instantiated>>;
  ctx: CTX;
}

export function useFuncProps({ props, ctx }: Props): Record<string, FunctionalProperty> {
  return useMemo(() => {
    return Object.entries(props).reduce<Record<string, FunctionalProperty>>((acc, [key, func]) => {
      // just binding execution context is enough
      acc[key] = func.bind(ctx);

      return acc;
    }, {});
  }, []);
}
