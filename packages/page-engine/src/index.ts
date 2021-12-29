import Designer from './designer';
import { useCtx, CtxValue } from './ctx';
import stores from './stores';

const getStore = (): CtxValue => stores;

export * from './types';
export {
  Designer,
  useCtx,
  getStore,
};
export default Designer;
