import Designer from './designer';
import { useCtx, CtxValue } from './ctx';
import stores from './stores';
import DataBind from './designer/comps/config-item-bind';

const getStore = (): CtxValue => stores;

export * from './types';
export {
  Designer,
  useCtx,
  getStore,
  DataBind,
};
export default Designer;
