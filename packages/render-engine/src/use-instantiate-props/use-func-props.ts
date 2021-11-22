import { logger } from '@ofa/utils';
import { useMemo } from 'react';

import { NodePropType, SchemaNode, FunctionalProperty, Instantiated, StateConvertorFunc } from '../types';

export default function useFuncProps(node: SchemaNode<Instantiated>): Record<string, StateConvertorFunc> {
  return useMemo(() => {
    return Object.entries(node.props).filter((pair): pair is [string, FunctionalProperty<Instantiated>] => {
      return pair[1].type === NodePropType.FunctionalProperty;
    }).reduce<Record<string, StateConvertorFunc>>((acc, [key, { func }]) => {
      acc[key] = (...args: any[]) => {
        try {
          func(...args);
        } catch (error) {
          logger.error(
            `an error occurred while run node '${node.key}' functional property:`,
            key,
            'with the following arguments:',
            '\n',
            args,
            '\n',
            'function is:',
            '\n',
            func.toString(),
            '\n',
            error,
          );
        }
      };

      return acc;
    }, {});
  }, []);
}
