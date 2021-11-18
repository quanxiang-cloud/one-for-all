import { useMemo } from 'react';

import { NodePropType, SchemaNode, FunctionalProperty, Instantiated, Adapter } from '../types';

export default function useFuncProps(node: SchemaNode<Instantiated>): Record<string, Adapter> {
  return useMemo(() => {
    return Object.entries(node.props).filter((pair): pair is [string, FunctionalProperty<Instantiated>] => {
      return pair[1].type === NodePropType.FunctionalProperty;
    }).reduce<Record<string, Adapter>>((acc, [key, { func }]) => {
      acc[key] = func;

      return acc;
    }, {});
  }, []);
}
