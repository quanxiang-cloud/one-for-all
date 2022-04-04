import React, { useMemo, useEffect, Component } from "react";
import { Artery } from '@one-for-all/artery';
import type { BehaviorSubject } from "rxjs";

import Core from './core';
import { uuid } from './utils';
import { useSchema, useLayers, useObservable } from './hooks';
import { create as createSchemaStore } from './stores/schema';
import { create as createLayersStore, registryLayers } from './stores/layer';
import { create as createEngineStore, getContext as getEngineStoreContext } from './stores/engine';

import './styles/index.scss';

interface Props<T extends PageEngineV2.BaseBlocksCommunicationState> extends PageEngineV2.Props<T> {
  engineId: string;
  setSchemaStore: (store: BehaviorSubject<Artery>) => void;
  setLayersStore: (store: BehaviorSubject<PageEngineV2.Layer<T>[]>) => void;
}

function App<T extends PageEngineV2.BaseBlocksCommunicationState>({ schema, layers, setSchemaStore, setLayersStore, engineId }: Props<T>): JSX.Element {
  const schemaStore$ = useMemo(() => createSchemaStore(schema), [schema]);
  const layersStore$ = useMemo(() => createLayersStore(layers), [layers]);
  const engineStore$ = useMemo(() => createEngineStore<T>({ schemaStore$ }), [schemaStore$]);
  const EngineStoreContext = useMemo(() => getEngineStoreContext<T>(engineId), [engineId]);

  useEffect(() => {
    setSchemaStore(schemaStore$);
  }, [schemaStore$]);

  useEffect(() => {
    setLayersStore(layersStore$);
  }, [layersStore$]);

  return (
    <EngineStoreContext.Provider value={engineStore$}>
      <Core<T> layersStore$={layersStore$} engineId={engineId} />
    </EngineStoreContext.Provider>
  )
}

export interface PageEngineProps<T extends PageEngineV2.BaseBlocksCommunicationState> {
  schema: Artery;
  layers: PageEngineV2.Layer<T>[];
}

export default class PageEngine<T extends PageEngineV2.BaseBlocksCommunicationState> extends Component<PageEngineProps<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instanceMap: Record<string, PageEngine<any>> = {};
  private schema: Artery;
  private layers: PageEngineV2.Layer<T>[];
  private schemaStore$!: BehaviorSubject<Artery>;
  private layerStore$!: BehaviorSubject<PageEngineV2.Layer<T>[]>;
  public engineId: string;
  public static useObservable = useObservable;

  public constructor(props: PageEngineProps<T>) {
    super(props);
    const { schema, layers } = props;
    this.schema = schema;
    this.layers = layers;
    this.engineId= uuid();
    PageEngine.instanceMap[this.engineId] = this;
  }

  public static useSchema = (engineId: string): Artery => {
    const engine = PageEngine.instanceMap[engineId];
    return useSchema(engine.schemaStore$, engine.schema);
  }

  public static useLayers<T extends PageEngineV2.BaseBlocksCommunicationState>(engineId: string): PageEngineV2.Layer<T>[] {
    const engine = PageEngine.instanceMap[engineId];
    return useLayers(engine.layerStore$);
  }

  public static registryLayers<T extends PageEngineV2.BaseBlocksCommunicationState>(engineId: string, layers: PageEngineV2.Layer<T>[]): void {
    const engine = PageEngine.instanceMap[engineId];
    return registryLayers(engine.layerStore$, layers);
  }

  private setSchemaStore = (store$: BehaviorSubject<Artery>): void => {
    this.schemaStore$ = store$;
  }

  private setLayersStore = (store$: BehaviorSubject<PageEngineV2.Layer<T>[]>): void => {
    this.layerStore$ = store$;
  }

  public render = (): JSX.Element => {
    return (
      <App<T>
        schema={this.schema}
        layers={this.layers}
        setSchemaStore={this.setSchemaStore}
        setLayersStore={this.setLayersStore}
        engineId={this.engineId}
      />
    )
  }
}
