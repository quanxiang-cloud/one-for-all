import { DependencyList, useEffect } from 'react';
import useTimeoutFn from './use-timeout-fn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export default function useDebounce(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  ms = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(reset, deps);

  return [isReady, cancel];
}
