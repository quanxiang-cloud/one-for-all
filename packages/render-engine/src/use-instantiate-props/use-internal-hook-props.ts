import { useMemo } from 'react';

import { Instantiated, SchemaNode, CTX, VersatileFunc } from '../types';

type InternalHookProps = Record<string, VersatileFunc | undefined>;

// todo give this hook a better name
function useInternalHookProps(node: SchemaNode<Instantiated>, ctx: CTX): InternalHookProps {
  return useMemo(() => {
    if (node.supportStateExposure) {
      return {
        __exposeState: (state: any): void => {
          ctx.nodeStates.expose(node.key, state);
        },
      };
    }

    return {};
  }, []);
}

export default useInternalHookProps;
