import React, { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
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
  setSchemaStore: (store: BehaviorSubject<SchemaSpec.Schema>) => void;
  setLayerStore: (store: BehaviorSubject<PageEngineV2.Layer<T>[]>) => void;
}

function App<T extends PageEngineV2.BaseBlocksCommunicationState>({ schema, layers, setSchemaStore, setLayerStore, engineId }: Props<T>): JSX.Element {
  const schemaStore$ = useMemo(() => createSchemaStore(schema), [schema]);
  const layersStore$ = useMemo(() => createLayersStore(layers), [layers]);
  const engineStore$ = useMemo(() => createEngineStore<T>({ schemaStore$ }), [schemaStore$]);
  const EngineStoreContext = useMemo(() => getEngineStoreContext<T>(engineId), [engineId]);

  useEffect(() => {
    setSchemaStore(schemaStore$);
  }, [schemaStore$]);

  useEffect(() => {
    setLayerStore(layersStore$);
  }, [layersStore$]);

  return (
    <EngineStoreContext.Provider value={engineStore$}>
      <Core<T> layersStore$={layersStore$} engineId={engineId} />
    </EngineStoreContext.Provider>
  )
}

export default class PageEngine<T extends PageEngineV2.BaseBlocksCommunicationState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instanceMap: Record<string, PageEngine<any>> = {};
  private schema: SchemaSpec.Schema;
  private layers: PageEngineV2.Layer<T>[];
  private schemaStore$!: BehaviorSubject<SchemaSpec.Schema>;
  private layerStore$!: BehaviorSubject<PageEngineV2.Layer<T>[]>;
  public engineId: string;
  public static useObservable = useObservable;

  public constructor(schema: SchemaSpec.Schema, layers: PageEngineV2.Layer<T>[]) {
    this.schema = schema;
    this.layers = layers;
    this.engineId= uuid();
    PageEngine.instanceMap[this.engineId] = this;
  }

  public static useSchema = (engineId: string): SchemaSpec.Schema => {
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

  private setSchemaStore = (store$: BehaviorSubject<SchemaSpec.Schema>): void => {
    this.schemaStore$ = store$;
  }

  private setLayerStore = (store$: BehaviorSubject<PageEngineV2.Layer<T>[]>): void => {
    this.layerStore$ = store$;
  }

  public render = (selector: string): void => {
    ReactDOM.render(
      <App<T>
        schema={this.schema}
        layers={this.layers}
        setSchemaStore={this.setSchemaStore}
        setLayerStore={this.setLayerStore}
        engineId={this.engineId}
      />,
      document.getElementById(selector)
    );
  }
}
