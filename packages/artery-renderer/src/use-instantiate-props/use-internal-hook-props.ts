import { useContext, useMemo } from 'react';
import PathContext from '../node-render/path-context';

import { ArteryNode, VersatileFunc } from '../types';
import useCTX from '../use-ctx';

type InternalHookProps = Record<string, VersatileFunc | undefined>;

// todo give this hook a better name
function useInternalHookProps(node: ArteryNode): InternalHookProps {
  const ctx = useCTX();
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
