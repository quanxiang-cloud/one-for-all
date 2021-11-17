import { useMemo } from 'react';

import { logger } from '@ofa/utils';

import {
  CTX,
  Instantiated,
  SharedStateMutationProperty,
  NodePropType,
  SchemaNode,
} from '../types';

type MutateProps = Record<string, (value: any) => void>;

function useSharedStateMutationProps(node: SchemaNode<Instantiated>, ctx: CTX): MutateProps {
  return useMemo(() => {
    return Object.entries(node.props)
      .filter((pair): pair is [string, SharedStateMutationProperty<Instantiated>] => {
        return pair[1].type === NodePropType.SharedStateMutationProperty;
      }).reduce<MutateProps>((acc, [key, { stateID, adapter }]) => {
        const state$ = ctx.sharedStates.getState$(stateID);
        acc[key] = (value: any) => {
          if (typeof adapter !== 'function') {
            state$.next(value);
            return;
          }

          try {
            const v = adapter(value);
            state$.next(v);
          } catch (error) {
            logger.error('failed to run adapter:\n', adapter.toString(), '\n', error);
          }
        };

        return acc;
      }, {});
  }, []);
}

export default useSharedStateMutationProps;
