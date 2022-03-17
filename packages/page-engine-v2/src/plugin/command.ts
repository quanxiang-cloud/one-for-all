/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from "react";
import { clone } from 'ramda';

import { removeNodeFromSchemaByNodeId, removeAllNodeFromSchema } from "../utils";

interface CommandExecute {
  undo?: () => void;
  redo?: () => void;
}

type CommandName = string | ('undo' | 'redo' | 'delete' | 'clear');
interface Command {
  name: CommandName; // 命令的唯一标识
  keyboard?: string | string[]; // 命令监听的快捷键
  execute: (...args: any[]) => CommandExecute; // 命令具体实现的动作
  followQueue?: boolean; // 命令执行完之后， 是否需要将CommandExecute放入命令队列
  init?: () => ((() => void) | undefined); // 命令初始化函数
  data?: any; // 命令缓存所需要的数据
}

type CommandName2Execute = Record<CommandName, (...args: any[]) => void>;
interface State {
  current: number;
  queue: CommandExecute[];
  commands: Array<Command>;
  commandName2Execute: CommandName2Execute;
  destroyList: Array<((() => void) | undefined)>;
}
interface UseCommandExpose {
  registry: (command: Command) => void;
  useInit: () => void;
  commands: CommandName2Execute;
}
export function useCommand(): UseCommandExpose {
  const commandStateRef = useRef<State>({
    current: -1, // 当前命令队列中最后执行的命令返回的 CommandExecute 对象
    queue: [], // undo redo 命令队列
    commands: [], // 命令的数组
    commandName2Execute: {}, // 通过命令名称获取命令执行函数的映射
    destroyList: [], // 命令销毁函数的数组
  })

  const registry = useCallback((command: Command): void => {
    const { commands, commandName2Execute, queue, current } = commandStateRef.current;
    if (commandName2Execute[command.name]) {
      const existIndex = commands.findIndex(item => item.name === command.name);
      commands.splice(existIndex, 1)
    }
    commands.push(command);
    commandName2Execute[command.name] = (...args: any[]) => {
      const { redo, undo }= command.execute(...args);
      if (!redo) {
        return;
      }
      redo();
      if (command.followQueue === false) {
        return;
      }
      if (queue.length) {
        commandStateRef.current.queue = queue.slice(0, current + 1);
      }
      commandStateRef.current.queue.push({ redo, undo });
      commandStateRef.current.current = current + 1;
    };
  }, []);

  const onKeydown = useCallback((e: KeyboardEvent): void => {
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
    commandStateRef.current.commands.forEach(command => {
      if (!command.keyboard) {
       return
      }
      const keys = Array.isArray(command.keyboard) ? command.keyboard : [command.keyboard];
      if (keys.includes(keyNames)) {
        commandStateRef.current.commandName2Execute[command.name]();
        e.stopPropagation();
        e.preventDefault();
      }
    })
  }, []);

  const useInit = useCallback(() => {
    useEffect(() => {
      const { commands, destroyList } = commandStateRef.current;
      commands.forEach(command => {
        const init = command.init;
        if (init) {
          destroyList.push(init());
        }
      })
      registry({
        name: 'undo',
        keyboard: ['ctrl+z'],
        followQueue: false,
        execute() {
          return {
            redo: () => {
              const { current, queue } = commandStateRef.current;
              if (current === -1) {
                return;
              }
              queue[current].undo?.();
              commandStateRef.current.current--;
            }
          }
        }
      })
      registry({
        name: 'redo',
        keyboard: ['ctrl+y', 'ctrl+shift+z'],
        followQueue: false,
        execute() {
          return {
            redo: () => {
              const { current, queue } = commandStateRef.current;
              if (current === queue.length - 1) {
                return;
              }
              queue[current + 1].redo?.();
              commandStateRef.current.current++;
            }
          }
        }
      })
    }, []);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeydown, true);
    return () => {
      window.removeEventListener('keydown', onKeydown, true);
      commandStateRef.current.destroyList.forEach(fn => fn?.());
    }
  }, []);

  return {
    registry,
    useInit,
    commands: commandStateRef.current.commandName2Execute,
  }
}

interface Props<T extends PageEngineV2.BaseBlocksCommunicationState> {
  schema: PageEngineV2.Schema;
  onChange: (schema: PageEngineV2.Schema) => void;
  blocksCommunicationState$: PageEngineV2.BlocksCommunicationState<T>;
}
export function useCanvasCommand<T extends PageEngineV2.BaseBlocksCommunicationState>(
  {  schema, onChange, blocksCommunicationState$  }: Props<T>
): UseCommandExpose {
  const expose = useCommand();
  expose.registry({
    name: 'delete',
    keyboard: ['delete', 'backspace', 'ctrl+d'],
    execute() {
      const beforeSchema = clone(schema);
      const { activeNodeID } = blocksCommunicationState$.getValue();
      if (!activeNodeID) {
        return {};
      }
      const afterSchema = removeNodeFromSchemaByNodeId(schema, activeNodeID);
      return {
        redo() {
          onChange(afterSchema);
          blocksCommunicationState$.next({...blocksCommunicationState$.getValue(), activeNodeID: '' });
        },
        undo() {
          onChange(beforeSchema);
          blocksCommunicationState$.next({...blocksCommunicationState$.getValue(), activeNodeID });
        },
      };
    },
  });
  expose.registry({
    name: 'clear',
    keyboard: ['ctrl+c'],
    execute() {
      const beforeSchema = clone(schema);
      const afterSchema = removeAllNodeFromSchema(schema);
      const { activeNodeID } = blocksCommunicationState$.getValue();
      return {
        redo() {
          onChange(afterSchema);
          blocksCommunicationState$.next({...blocksCommunicationState$.getValue(), activeNodeID: '' });
        },
        undo() {
          onChange(beforeSchema);
          blocksCommunicationState$.next({...blocksCommunicationState$.getValue(), activeNodeID });
        },
      };
    }
  })
  return expose;
}
