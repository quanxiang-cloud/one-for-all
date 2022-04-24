import React, { createContext, useContext, PropsWithChildren } from 'react';

import { Store } from './stores/engine';

const EngineStoreContext = createContext<Store<ArteryEngine.BaseBlocksCommunicationState>>(
  new Store<ArteryEngine.BaseBlocksCommunicationState>({})
);

type Props = PropsWithChildren<{
  value: Store<ArteryEngine.BaseBlocksCommunicationState>;
}>
export function EngineStoreContextProvider({ children, value }: Props): JSX.Element {
  return (
    <EngineStoreContext.Provider value={value}>
      {children}
    </EngineStoreContext.Provider>
  )
}

export function useEngineStoreContext(): Store<ArteryEngine.BaseBlocksCommunicationState> {
  return useContext(EngineStoreContext);
}
