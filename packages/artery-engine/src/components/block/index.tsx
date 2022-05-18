import React, { useCallback } from 'react';
import { lensPath, set } from 'ramda';
import { Artery, Node } from '@one-for-all/artery';

import { useObservable } from '@arteryEngine/hooks';
import { set as setArtery } from '@arteryEngine/stores/artery';
import { generateNodeId } from '@arteryEngine/utils';
import { useEngineStoreContext } from '@arteryEngine/context';

export default function Block<T extends ArteryEngine.BaseBlocksCommunicationState>(props: ArteryEngine.BlockProps<T>): JSX.Element | null {
  const { style, render: Render, id = '', onUpdateLayer } = props;
  const engineStore$ = useEngineStoreContext();
  const engineState = useObservable<ArteryEngine.EngineState<T>>(engineStore$, {});
  const { arteryStore$, blocksCommunicationState$, activeNode, useCommandState } = engineState;
  const artery = useObservable<Artery | undefined>(arteryStore$, undefined);
  const sharedState = useObservable<T>(blocksCommunicationState$, {} as T);

  useCommandState?.registry({
    name: 'updateArtery',
    execute: (newArtery: Artery) => {
      if (!artery) {
        return {};
      }
      return {
        redo() { setArtery(arteryStore$, newArtery); },
        undo() { setArtery(arteryStore$, artery); },
      };
    }
  })

  const handleArteryChange = useCallback((artery: Artery): void => {
    useCommandState?.commandNameRunnerMap?.updateArtery?.(artery);
  }, [useCommandState]);

  const handleSharedStateChange = useCallback((path: string, value: T): void => {
    blocksCommunicationState$.next(set(lensPath(path.split('.')), value, sharedState));
  }, [sharedState, blocksCommunicationState$]);

  const handleSetActiveNode = useCallback((node?: Node): void => {
    engineStore$.setActiveNode(node);
  }, [engineStore$]);

  const onUpdateBlock = useCallback((params: Omit<ArteryEngine.UpdateLayer, 'layerId'> & { layerId?: string }): void => {
    onUpdateLayer({ ...params, blockId: params.blockId ?? id });
  }, [id, onUpdateLayer]);

  const { currentUndoRedoIndex, redoUndoList } = useCommandState?.commandStateRef?.current ?? {};
  const commandsHasNext = currentUndoRedoIndex < redoUndoList.length - 1;
  const commandsHasPrev = currentUndoRedoIndex > -1;

  if (!artery || !blocksCommunicationState$) {
    return null;
  }

  return (
    <div className="artery-engine-layer-block" style={style}>
      <Render
        artery={artery}
        onChange={handleArteryChange}
        sharedState={sharedState}
        onSharedStateChange={handleSharedStateChange}
        activeNode={activeNode}
        commands={useCommandState?.commandNameRunnerMap}
        commandsHasNext={commandsHasNext}
        commandsHasPrev={commandsHasPrev}
        generateNodeId={generateNodeId}
        setActiveNode={handleSetActiveNode}
        onUpdateLayer={onUpdateLayer}
        onUpdateBlock={onUpdateBlock}
      />
    </div>
  )
}
