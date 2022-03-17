import { useEffect, useState } from 'react';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import type { Location } from 'history';

import { isParamHolder } from './utils';

export function exactlyCheck(path: string, currentRoutePath: string): boolean {
  const pathFragments = path.split('/');
  const routeFragments = currentRoutePath.split('/');
  if (pathFragments.length !== routeFragments.length) {
    return false;
  }

  return pathFragments.every((fragment, index) => {
    if (isParamHolder(routeFragments[index])) {
      return true;
    }

    return fragment === routeFragments[index];
  });
}

export function prefixCheck(path: string, currentRoutePath: string): boolean {
  const pathFragments = path.split('/');
  const routeFragments = currentRoutePath.split('/');
  if (pathFragments.length < routeFragments.length) {
    return false;
  }

  return routeFragments.every((fragment, index) => {
    if (isParamHolder(fragment)) {
      return true;
    }

    return fragment === pathFragments[index];
  });
}

function useMatch(location$: BehaviorSubject<Location>, currentRoutePath: string, exactly: boolean): boolean {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const subscribe = location$
      .pipe(
        map(({ pathname }): boolean => {
          return exactly ? exactlyCheck(pathname, currentRoutePath) : prefixCheck(pathname, currentRoutePath);
        }),
        distinctUntilChanged(),
      )
      .subscribe(setMatch);

    return () => subscribe.unsubscribe();
  }, []);

  return match;
}

export default useMatch;
