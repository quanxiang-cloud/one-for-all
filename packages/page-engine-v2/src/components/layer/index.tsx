import React, { CSSProperties, useMemo, useEffect, useContext } from "react";
import { BehaviorSubject } from "rxjs";

import Block from '../block';
import { getContext as getEngineStoreContext, update as updateEngineStore  } from '../../stores/engine';

import './style.scss';

export default function Layer<T extends PageEngineV2.BaseBlocksCommunicationState>(props: PageEngineV2.LayerProps<T>): JSX.Element {
  const { blocks, gridTemplateColumns, gridTemplateRows, zIndex, engineId, blocksCommunicationStateInitialValue, setLayer } = props;
  const EngineStoreContext = useMemo(() => getEngineStoreContext<T>(engineId), [engineId]);
  const engineStore$ = useContext(EngineStoreContext);
  const blocksCommunicationState$ = useMemo(
    () => new BehaviorSubject<T>(blocksCommunicationStateInitialValue),
    [blocksCommunicationStateInitialValue]
  );

  useEffect(() => {
    updateEngineStore(engineStore$, { blocksCommunicationState$ });
  }, [blocksCommunicationState$]);

  const pageEngineLayerStyle: CSSProperties = {
    display: 'grid',
    gap: '1px',
    gridTemplateColumns,
    gridTemplateRows,
    zIndex,
  }

  return (
    <div className="page-engine-layer" style={pageEngineLayerStyle}>
      {blocks.filter(({ visible }) => visible !== false).map((block, index) => (
        <Block<T>
          {...block}
          key={index}
          engineId={engineId}
          setLayer={setLayer}
        />
      ))}
    </div>
  )
}
