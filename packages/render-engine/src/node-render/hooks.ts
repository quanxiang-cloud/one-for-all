import { useEffect } from 'react';

import type { LifecycleHooks, Instantiated } from '../types';

export function useLifecycleHook({ didMount, willUnmount }: LifecycleHooks<Instantiated>): void {
  useEffect(() => {
    if (didMount) {
      didMount();
    }

    return () => {
      willUnmount?.();
    };
  }, []);
}
