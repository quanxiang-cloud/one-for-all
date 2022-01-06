import Designer from './designer';
import { useCtx, CtxValue } from './ctx';
import stores from './stores';
import useUpdateEffect from './hooks/use-update-effect';
import useDebounce from './hooks/use-debounce';

const getStore = (): CtxValue => stores;

export * from './types';
export {
  Designer,
  useCtx,
  getStore,
  useUpdateEffect,
  useDebounce,
};
export default Designer;
