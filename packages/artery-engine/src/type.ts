import type { MutableRefObject, CSSProperties  } from 'react';
import type { BehaviorSubject } from 'rxjs';
import type { Artery, Node } from '@one-for-all/artery';

export interface Block<T extends BaseBlocksCommunicationState> {
  render: (props: BlockItemProps<T>) => JSX.Element;
  style?: CSSProperties;
  hide?: boolean;
  id?: string;
}

export interface BlockProps<T extends BaseBlocksCommunicationState> extends Block<T> {
  onUpdateLayer: (params: Omit<UpdateLayer, 'layerId'> & { layerId?: string }) => void;
}

export interface Layer<T extends BaseBlocksCommunicationState> {
  blocks: Array<Block<T>>;
  style?: CSSProperties;
  id?: string;
  hide?: boolean;
}

export interface LayerProps<T extends BaseBlocksCommunicationState> extends Layer<T> {
  zIndex: number;
  updateLayer: (params: UpdateLayer) => void;
}

export type LayerTransfer<T extends BaseBlocksCommunicationState> = (layer: Layer<T>) => Layer<T>;

export interface BaseBlocksCommunicationState {
  [key: string]: any;
}

export type BlocksCommunicationState<T extends BaseBlocksCommunicationState> = BehaviorSubject<T>;
export interface BlockItemProps<T extends BaseBlocksCommunicationState> {
  onChange: (artery: Artery) => void;
  artery: Artery;
  sharedState: T;
  onSharedStateChange: (path: string, value: any) => void;
  commands?: CommandNameRunnerMap;
  commandsHasNext: boolean;
  commandsHasPrev: boolean;
  activeNode?: Node;
  setActiveNode: (node?: Node) => void;
  generateNodeId: (prefix?: string) => string;
  onUpdateLayer: (params: Omit<UpdateLayer, 'blockId' | 'layerId'> & { layerId?: string }) => void;
  onUpdateBlock: (params: Omit<UpdateLayer, 'layerId'> & { layerId?: string }) => void;
}

export interface Props<T extends BaseBlocksCommunicationState> {
  artery: Artery;
  layers: Array<Layer<T>>;
  blocksCommunicationStateInitialValue: T;
}

export interface EngineState<T extends BaseBlocksCommunicationState> {
  arteryStore$?: BehaviorSubject<Artery>;
  blocksCommunicationState$?: BlocksCommunicationState<T>;
  activeNode?: Node;
  useCommandState?: UseCommandState;
}

interface RedoUndo {
  undo?: () => void;
  redo?: () => void;
}

export interface Command {
  name: string;
  // eslint-disable-next-line
  execute: (...args: any[]) => RedoUndo;
  initer?: () => ((() => void) | undefined);
  keyboard?: string | string[];
}

// eslint-disable-next-line
export type CommandExecuteWrapper = (...args: any[]) => void;
export type CommandNameRunnerMap = Record<string, CommandExecuteWrapper>;

export interface CommandState {
  currentUndoRedoIndex: number;
  redoUndoList: RedoUndo[];
  commandList: Array<Command>;
  commandNameRunnerMap: CommandNameRunnerMap;
  destroyList: Array<((() => void) | undefined)>;
}

export interface UseCommandState {
  commandStateRef: MutableRefObject<CommandState>;
  registry: (command: Command) => void;
  commandNameRunnerMap: CommandNameRunnerMap;
}

export interface UpdateLayer {
  layerId: string;
  blockId?: string;
  name: string;
  value: unknown;
}
