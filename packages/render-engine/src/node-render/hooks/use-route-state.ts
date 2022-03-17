import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

function useRouteMatchedState(routeState$: BehaviorSubject<Location>, currentRoutePath: string): boolean {
  const [state, setState] = useState(routeState$.value);

  useEffect(() => {
    const subscription = routeState$.subscribe((state) => {
      console.log(state, currentRoutePath);
      setState(state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state.pathname?.startsWith(currentRoutePath);
}

export default useRouteMatchedState;
