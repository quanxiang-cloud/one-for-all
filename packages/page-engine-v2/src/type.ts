import type { BehaviorSubject } from 'rxjs';
import type { Artery } from '@one-for-all/artery';

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
  setLayer: (transfer: LayerTransfer<T>) => void;
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
  setLayer: (transfer: LayerTransfer<T>) => void;
}

export type LayerTransfer<T extends BaseBlocksCommunicationState> = (layer: Layer<T>) => Layer<T>;

export interface BaseBlocksCommunicationState {
  activeNodeID: string;
}

export type BlocksCommunicationState<T extends BaseBlocksCommunicationState> = BehaviorSubject<T>;
export interface BlockItemProps<T extends BaseBlocksCommunicationState> {
  engineId: string;
  onChange: (schema: Artery) => void;
  schema: Artery;
  blocksCommunicationState$: BlocksCommunicationState<T>;
  setLayer: (transfer: LayerTransfer<T>) => void;
}

export interface Props<T extends BaseBlocksCommunicationState> {
  schema: Artery;
  layers: Array<Layer<T>>;
}

export interface EngineState<T extends BaseBlocksCommunicationState> {
  schemaStore$?: BehaviorSubject<Artery>;
  blocksCommunicationState$?: BlocksCommunicationState<T>;
}
