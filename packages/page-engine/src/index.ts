import Designer from './designer';
import { useCtx, CtxValue } from './ctx';
import stores from './stores';
import toRenderSchema from './core/schema-adapter/render-schema-adapter';

const getStore = (): CtxValue => stores;

export {
  Designer,
  useCtx,
  getStore,
  toRenderSchema,
};
