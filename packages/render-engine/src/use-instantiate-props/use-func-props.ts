import { useMemo } from 'react';

import { NodePropType, SchemaNode, FunctionalProperty, Instantiated, VersatileFunc } from '../types';

export default function useFuncProps(node: SchemaNode<Instantiated>): Record<string, VersatileFunc> {
  return useMemo(() => {
    return Object.entries(node.props).filter((pair): pair is [string, FunctionalProperty<Instantiated>] => {
      return pair[1].type === NodePropType.FunctionalProperty;
    }).reduce<Record<string, VersatileFunc>>((acc, [key, { func }]) => {
      acc[key] = func;

      return acc;
    }, {});
  }, []);
}
