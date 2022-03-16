import { useEffect, useState } from 'react';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { Location } from 'history';

import type { RouteNode } from '../../types';
import { isParamHolder } from './utils';

function exactlyCheck(location: Location, currentRoutePath: string): boolean {
  const pathFragments = location.pathname.split('/');
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

function prefixCheck(location: Location, currentRoutePath: string): boolean {
  const pathFragments = location.pathname.split('/');
  const routeFragments = currentRoutePath.split('/');

  if (pathFragments.length <= routeFragments.length) {
    return false;
  }

  return routeFragments.every((fragment, index) => {
    if (isParamHolder(fragment)) {
      return true;
    }

    return fragment === pathFragments[index];
  });
}

function useMatch(node: RouteNode, location$: BehaviorSubject<Location>, currentRoutePath: string): boolean {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const subscribe = location$.pipe(
      map((location): boolean => {
        return node.exactly ? exactlyCheck(location, currentRoutePath) : prefixCheck(location, currentRoutePath);
      }),
      distinctUntilChanged(),
    ).subscribe(setMatch);

    return () => subscribe.unsubscribe();
  }, []);

  return match;
}

export default useMatch;
