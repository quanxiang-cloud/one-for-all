import { createContext, useContext } from 'react';
import { Emitter } from 'mitt';

import PageStore from './stores/page';
import RegistryStore from './stores/registry';
import DesignerStore from './stores/designer';
import DataSourceStore from './stores/data-source';

export type CtxValue = {
  page: typeof PageStore;
  registry: typeof RegistryStore;
  designer: typeof DesignerStore;
  dataSource: typeof DataSourceStore;
  eventBus: Emitter<any>;
  [key: string]: any;
}

const ctx = createContext<CtxValue>({} as CtxValue);

export function useCtx(): CtxValue {
  return useContext(ctx);
}

export default ctx;
