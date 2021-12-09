import { logger } from '@ofa/utils';
import { useMemo } from 'react';

import { NodePropType, SchemaNode, FunctionalProperty, Instantiated, VersatileFunc } from '../types';

export default function useFuncProps(node: SchemaNode<Instantiated>): Record<string, VersatileFunc> {
  return useMemo(() => {
    if (!node.props) {
      return {};
    }

    return Object.entries(node.props).filter((pair): pair is [string, FunctionalProperty<Instantiated>] => {
      return pair[1].type === NodePropType.FunctionalProperty;
    }).reduce<Record<string, VersatileFunc>>((acc, [key, { func }]) => {
      acc[key] = (...args: unknown[]) => {
        try {
          func(...args);
        } catch (error) {
          logger.error(
            `an error occurred while run node '${node.id}' functional property:`,
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