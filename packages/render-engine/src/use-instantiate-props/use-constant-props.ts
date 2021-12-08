import { useMemo } from 'react';

import {
  ConstantProperty,
  Instantiated,
  NodePropType,
  SchemaNode,
} from '../types';

export default function useConstantProps(node: SchemaNode<Instantiated>): Record<string, unknown> {
  return useMemo(() => {
    if (!node.props) {
      return {};
    }

    return Object.entries(node.props).filter((pair): pair is [string, ConstantProperty] => {
      return pair[1].type === NodePropType.ConstantProperty;
    }).reduce<Record<string, unknown>>((acc, [key, { value }]) => {
      acc[key] = value;
      return acc;
    }, {});
  }, []);
}
