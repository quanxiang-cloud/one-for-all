import React, { useMemo, useEffect } from "react";
import type { Artery } from '@one-for-all/artery';

import Core from './core';
import {  useCommand } from './plugin/command';
import { createArteryStore, createLayersStore, createEngineStore  } from './stores';
import { EngineStoreContextProvider } from './context';
import { buildeLayerId } from "./utils";

import './styles/index.scss';

export interface Props<T> {
  artery: Artery;
  layers: ArteryEngine.Layer<T>[];
}

export default function ArteryEngine<T extends ArteryEngine.BaseBlocksCommunicationState>(props: ArteryEngine.Props<T>): JSX.Element {
  const { artery, layers, blocksCommunicationStateInitialValue } = props;
  const arteryStore$ = useMemo(() => createArteryStore(artery), []);
  const useCommandState = useCommand();
  const engineStore$ = useMemo(() => createEngineStore<T>({ arteryStore$, useCommandState }), []);
  const layersStore$ = useMemo(() => createLayersStore(layers.map(buildeLayerId)), []);

  useEffect(() => {
    engineStore$.setArteryStore(arteryStore$);
  }, [arteryStore$]);

  return (
    <EngineStoreContextProvider value={engineStore$}>
      <Core<T> layersStore$={layersStore$} blocksCommunicationStateInitialValue={blocksCommunicationStateInitialValue} />
    </EngineStoreContextProvider>
  )
}
