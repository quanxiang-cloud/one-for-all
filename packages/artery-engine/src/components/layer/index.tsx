import React, { CSSProperties, useMemo, useEffect, useCallback } from "react";
import { BehaviorSubject } from "rxjs";

import { useEngineStoreContext } from '@arteryEngine/context';

import Block from '../block';

import './style.scss';

export default function Layer<T extends ArteryEngine.BaseBlocksCommunicationState>(props: ArteryEngine.LayerProps<T>): JSX.Element {
  const { blocks, gridTemplateColumns, gridTemplateRows, zIndex, blocksCommunicationStateInitialValue, setLayer } = props;
  const engineStore$ = useEngineStoreContext();
  const blocksCommunicationState$ = useMemo(() => new BehaviorSubject<T>(blocksCommunicationStateInitialValue), []);

  useEffect(() => {
    engineStore$.setBlocksCommunicationState<T>(blocksCommunicationState$);
  }, []);

  const arteryEngineLayerStyle: CSSProperties = {
    display: 'grid',
    gap: '1px',
    gridTemplateColumns,
    gridTemplateRows,
    zIndex,
  }

  const visibleFilter = useCallback(({ visible }: ArteryEngine.Block<T>): boolean => {
    return visible !== false;
  }, []);

  return (
    <div className="artery-engine-layer" style={arteryEngineLayerStyle}>
      {blocks.filter(visibleFilter).map((block, index) => (
        <Block<T>
          {...block}
          key={index}
          setLayer={setLayer}
        />
      ))}
    </div>
  )
}
