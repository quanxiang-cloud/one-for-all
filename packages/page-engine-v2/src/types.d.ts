declare namespace PageEngineV2 {
  export interface Block<T extends BaseBlocksCommunicationState> {
    render: (props: BlockItemProps<T>) => JSX.Element;
    gridColumnStart?: string;
    gridColumnEnd?: string;
    gridRowStart?: string;
    gridRowEnd?: string;
    visible?: boolean;
  }

  export interface BlockProps<T extends BaseBlocksCommunicationState> extends Block<T> {
    engineId: string;
  }

  export interface Layer<T extends BaseBlocksCommunicationState> {
    blocks: Array<Block<T>>;
    gridTemplateColumns: string;
    gridTemplateRows: string;
    blocksCommunicationStateInitialValue: T;
  }

  export interface LayerProps<T extends BaseBlocksCommunicationState> extends Layer<T> {
    zIndex: number;
    engineId: string;
  }

  export interface BaseBlocksCommunicationState {
    activeNodeID: string;
  }

  export type BlocksCommunicationState<T extends BaseBlocksCommunicationState> = import('rxjs').BehaviorSubject<T>;
  export type Schema = import('@one-for-all/schema-spec').Schema;
  export type SchemaNode = import('@one-for-all/schema-spec').SchemaNode;
  export interface BlockItemProps<T extends BaseBlocksCommunicationState> {
    engineId: string;
    onChange: (schema: Schema) => void;
    schema: Schema;
    blocksCommunicationState$: BlocksCommunicationState<T>;
  }

  export interface Props<T extends BaseBlocksCommunicationState> {
    schema: Schema;
    layers: Array<Layer<T>>;
  }

  export interface EngineState<T extends BaseBlocksCommunicationState> {
    schemaStore$: BehaviorSubject<SchemaSpec.Schema>;
    blocksCommunicationState$?: PageEngineV2.BlocksCommunicationState<T>;
  }
}
