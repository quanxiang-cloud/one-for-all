declare namespace ArteryEngine {
  import type { Dispatch, SetStateAction } from 'react';
  import type { BehaviorSubject } from 'rxjs';
  import type { Artery, Node } from '@one-for-all/artery';

  export interface Block<T extends BaseBlocksCommunicationState> {
    render: (props: BlockItemProps<T>) => JSX.Element;
    gridColumnStart?: string;
    gridColumnEnd?: string;
    gridRowStart?: string;
    gridRowEnd?: string;
    visible?: boolean;
  }

  export interface BlockProps<T extends BaseBlocksCommunicationState> extends Block<T> {
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
    setLayer: (transfer: LayerTransfer<T>) => void;
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
    setLayer: (transfer: LayerTransfer<T>) => void;
    commands?: CommandNameRunnerMap;
    activeNode?: Node;
    setActiveNode: (node?: Node) => void;
    generateNodeId: (prefix?: string) => string;
  }

  export interface Props<T extends BaseBlocksCommunicationState> {
    artery: Artery;
    layers: Array<Layer<T>>;
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
    execute: (...args: any[]) => RedoUndo;
    initer?: () => ((() => void) | undefined);
    keyboard?: string | string[];
  }

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
}
