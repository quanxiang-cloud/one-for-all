import { useMemo } from 'react';

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
          const v = adapter ? adapter(value) : value;
          state$.next(v);
        };

        return acc;
      }, {});
  }, []);
}

export default useSharedStateMutationProps;
