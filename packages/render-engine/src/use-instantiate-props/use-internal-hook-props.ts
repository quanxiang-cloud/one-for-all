import { useMemo } from 'react';

import { Instantiated, SchemaNode, CTX, VersatileFunc } from '../types';

type InternalHookProps = Record<string, VersatileFunc | undefined>;

// todo give this hook a better name
function useInternalHookProps(node: SchemaNode<Instantiated>, ctx: CTX): InternalHookProps {
  return useMemo(() => {
    if (node.supportStateExposure) {
      return {
        __exposeState: (nodeInternalState: any): void => {
          ctx.nodeInternalStates.expose(node.key, nodeInternalState);
        },
      };
    }

    return {};
  }, []);
}

export default useInternalHookProps;
