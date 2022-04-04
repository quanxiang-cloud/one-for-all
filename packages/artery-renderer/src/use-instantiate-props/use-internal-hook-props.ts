import { useContext, useMemo } from 'react';
import PathContext from '../node-render/path-context';

import { ArteryNode, CTX, VersatileFunc } from '../types';

type InternalHookProps = Record<string, VersatileFunc | undefined>;

// todo give this hook a better name
function useInternalHookProps(node: ArteryNode, ctx: CTX): InternalHookProps {
  const parentPath = useContext(PathContext);
  return useMemo(() => {
    if ('supportStateExposure' in node && node.supportStateExposure) {
      return {
        __exposeState: (state: unknown): void => {
          ctx.statesHubShared.exposeNodeState(`${parentPath}/${node.id}`, state);
        },
      };
    }

    return {};
  }, []);
}

export default useInternalHookProps;
