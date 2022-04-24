import { useEffect, useRef, useCallback, MutableRefObject } from "react";
import { append, pick } from 'ramda';

export const initialCommandState = {
  currentUndoRedoIndex: -1,
  redoUndoList: [],
  commandList: [],
  commandNameRunnerMap: {},
  destroyList: [],
}

const getUndoCommand = (commandStateRef: MutableRefObject<ArteryEngine.CommandState>): ArteryEngine.Command => {
  return {
    name: 'undo',
    keyboard: ['ctrl+z'],
    execute() {
      return {
        redo: () => {
          const { currentUndoRedoIndex, redoUndoList } = commandStateRef.current;
          if (currentUndoRedoIndex === -1) {
            return;
          }
          redoUndoList[currentUndoRedoIndex].undo?.();
          commandStateRef.current.currentUndoRedoIndex--;
        }
      }
    }
  }
}

const getRedoCommand = (commandStateRef: MutableRefObject<ArteryEngine.CommandState>): ArteryEngine.Command => {
  return {
    name: 'redo',
    keyboard: ['ctrl+y', 'ctrl+shift+z'],
    execute() {
      return {
        redo: () => {
          const { currentUndoRedoIndex, redoUndoList } = commandStateRef.current;
          if (currentUndoRedoIndex === redoUndoList.length - 1) {
            return;
          }
          redoUndoList[currentUndoRedoIndex + 1].redo?.();
          commandStateRef.current.currentUndoRedoIndex++;
        }
      }
    }
  }
}

interface UseCommandExposeInternal {
  registry: (command: ArteryEngine.Command) => void;
  init: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  commandNameRunnerMap: ArteryEngine.CommandNameRunnerMap;
}
function useCommandInternal(commandStateRef: MutableRefObject<ArteryEngine.CommandState>): UseCommandExposeInternal {
  const { commandNameRunnerMap } = commandStateRef.current;

  const registry = useCallback((command: ArteryEngine.Command): void => {
    const { name, execute, initer } = command;
    const {
      commandList, commandNameRunnerMap, redoUndoList, currentUndoRedoIndex, destroyList,
    } = commandStateRef.current;
    const initEffect = initer?.();
    if (initEffect) {
      destroyList.push(initEffect);
    }
    if (commandNameRunnerMap[name]) {
      const existsIndex = commandList.findIndex(item => item.name === name);
      commandList.splice(existsIndex, 1);
    }
    commandList.push(command);
    commandNameRunnerMap[name] = (...args: unknown[]): void => {
      const { redo, undo }= execute(...args);
      if (!redo) {
        return;
      }
      redo();
      if (!undo) {
        return;
      }
      let newRedoUndoList = redoUndoList;
      if (newRedoUndoList.length) {
        newRedoUndoList = newRedoUndoList.slice(0, currentUndoRedoIndex + 1);
      }
      newRedoUndoList = append({ redo, undo }, newRedoUndoList);
      const newCurrentUndoRedoIndex = currentUndoRedoIndex + 1;
      Object.assign(commandStateRef.current, {
        redoUndoList: newRedoUndoList,
        currentUndoRedoIndex: newCurrentUndoRedoIndex,
      })
    }
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent): void => {
    const { commandList, commandNameRunnerMap } = commandStateRef.current;
    const { key, shiftKey, altKey, ctrlKey, metaKey } = e;
    const keys: string[] = [];
    if (ctrlKey || metaKey) {
     keys.push('ctrl');
    }
    if (shiftKey) {
      keys.push('shift');
    }
    if (altKey) {
      keys.push('alt');
    }
    keys.push(key.toLowerCase());
    const keyNames = keys.join('+');
    commandList.forEach(command => {
      if (!command.keyboard) {
       return
      }
      const keys = Array.isArray(command.keyboard) ? command.keyboard : [command.keyboard];
      if (keys.includes(keyNames)) {
        commandNameRunnerMap[command.name]?.();
        e.stopPropagation();
        e.preventDefault();
      }
    })
  }, []);

  const init = useCallback(() => {
    registry(getUndoCommand(commandStateRef));
    registry(getRedoCommand(commandStateRef));
  }, []);

  return { registry, onKeyDown, init, commandNameRunnerMap };
}

export type UseCommandExposePublic = Omit<UseCommandExposeInternal, 'init' | 'onKeyDown'>;
export function useCommandPublic(commandStateRef: MutableRefObject<ArteryEngine.CommandState>): UseCommandExposePublic {
  return pick(['registry', 'commandNameRunnerMap'], useCommandInternal(commandStateRef));
}

interface UseCommandExposeWithCommandStateRef extends UseCommandExposePublic {
  commandStateRef: MutableRefObject<ArteryEngine.CommandState>;
}
export function useCommand(): UseCommandExposeWithCommandStateRef {
  const commandStateRef = useRef<ArteryEngine.CommandState>(initialCommandState);
  const { registry, onKeyDown, init, commandNameRunnerMap } = useCommandInternal(commandStateRef);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      commandStateRef.current.destroyList.forEach(fn => fn?.());
    }
  }, [onKeyDown]);

  return { registry, commandNameRunnerMap, commandStateRef };
}
