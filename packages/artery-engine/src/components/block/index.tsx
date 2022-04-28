import React, { CSSProperties, useCallback } from 'react';
import { lensPath, set } from 'ramda';
import { Artery, Node } from '@one-for-all/artery';

import { useObservable } from '@arteryEngine/hooks';
import { set as setArtery } from '@arteryEngine/stores/artery';
import { generateNodeId } from '@arteryEngine/utils';
import { useEngineStoreContext } from '@arteryEngine/context';

export default function Block<T extends ArteryEngine.BaseBlocksCommunicationState>(props: ArteryEngine.BlockProps<T>): JSX.Element | null {
  const { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, render: Render, setLayer } = props;
  const engineStore$ = useEngineStoreContext();
  const engineState = useObservable<ArteryEngine.EngineState<T>>(engineStore$, {});
  const { arteryStore$, blocksCommunicationState$, activeNode, useCommandState } = engineState;
  const artery = useObservable<Artery | undefined>(arteryStore$, undefined);
  const sharedState = useObservable<T>(blocksCommunicationState$, {} as T);

  const style: CSSProperties = {
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
  }

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
        setLayer={setLayer}
        commands={useCommandState?.commandNameRunnerMap}
        generateNodeId={generateNodeId}
        setActiveNode={handleSetActiveNode}
      />
    </div>
  )
}
