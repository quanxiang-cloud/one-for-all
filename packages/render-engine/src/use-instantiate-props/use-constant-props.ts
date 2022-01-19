import type { ConstantProperty } from '@ofa/schema-spec';

import { SchemaNode } from '../types';

export default function useConstantProps(node: SchemaNode): Record<string, unknown> {
  if (!node.props) {
    return {};
  }

  return Object.entries(node.props).filter((pair): pair is [string, ConstantProperty] => {
    return pair[1].type === 'constant_property';
  }).reduce<Record<string, unknown>>((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {});
}
