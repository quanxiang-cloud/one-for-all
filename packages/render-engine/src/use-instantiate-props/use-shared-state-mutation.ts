import { useMemo } from 'react';

import { logger } from '@ofa/utils';

import {
  CTX,
  Instantiated,
  SharedStateMutationProperty,
  NodePropType,
  SchemaNode,
} from '../types';

type MutateProps = Record<string, (value: unknown) => void>;

function useSharedStateMutationProps(node: SchemaNode<Instantiated>, ctx: CTX): MutateProps {
  return useMemo(() => {
    if (!node.props) {
      return {};
    }

    return Object.entries(node.props)
      .filter((pair): pair is [string, SharedStateMutationProperty<Instantiated>] => {
        return pair[1].type === NodePropType.SharedStateMutationProperty;
      }).reduce<MutateProps>((acc, [key, { stateID, convertor }]) => {
        function mutation(state: unknown): void {
          if (typeof convertor !== 'function') {
            ctx.statesHubShared.mutateState(stateID, state);
            return;
          }

          try {
            const v = convertor(state);
            ctx.statesHubShared.mutateState(stateID, v);
          } catch (error) {
            logger.error('failed to run convertor:\n', convertor.toString(), '\n', error);
          }
        }

        acc[key] = mutation;
        return acc;
      }, {});
  }, []);
}

export default useSharedStateMutationProps;
