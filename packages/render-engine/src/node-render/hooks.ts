import { useEffect } from 'react';

import type { BaseNode, Instantiated } from '../types';

export function useLifecycleHook(node: BaseNode<Instantiated>): void {
  useEffect(() => {
    if (node.lifecycleHooks?.didMount) {
      node.lifecycleHooks.didMount();
    }

    return () => {
      node.lifecycleHooks?.willUnmount?.();
    };
  });
}
