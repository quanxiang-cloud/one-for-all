import Designer from './designer';
import { useCtx, CtxValue } from './ctx';
import stores from './stores';

const getStore = (): CtxValue => stores;

export {
  Designer,
  useCtx,
  getStore,
};
