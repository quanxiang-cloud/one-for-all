import { createContext, useContext } from 'react';

import PageStore from './stores/page';
import RegistryStore from './stores/registry';
import DesignerStore from './stores/designer';

export type CtxValue = {
  page: typeof PageStore;
  registry: typeof RegistryStore;
  designer: typeof DesignerStore;
  [key: string]: any;
}

const ctx = createContext<CtxValue>({} as CtxValue);

export function useCtx(): CtxValue {
  return useContext(ctx);
}

export default ctx;
