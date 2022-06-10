import React, { CSSProperties, useCallback } from "react";
import { mergeRight } from "ramda";

import Block from '../block';

import './style.scss';

export default function Layer<T extends ArteryEngine.BaseBlocksCommunicationState>(props: ArteryEngine.LayerProps<T>): JSX.Element {
  const { blocks, zIndex, style, updateLayer, id = '' } = props;
  const arteryEngineLayerStyle: CSSProperties = mergeRight({
    display: 'grid',
    gap: '1px',
    zIndex,
  }, style);

  const hideFilter = useCallback(({ hide }: ArteryEngine.Block<T>): boolean => {
    return hide !== true;
  }, []);

  const handleUpdateLayer = useCallback((params: Omit<ArteryEngine.UpdateLayer, 'layerId'> & { layerId?: string }): void => {
    updateLayer({ ...params, layerId: params.layerId ?? id });
  }, [id, updateLayer]);

  return (
    <div className="artery-engine-layer" style={arteryEngineLayerStyle}>
      {blocks.filter(hideFilter).map((block) => (
        <Block<T>
          {...block}
          key={block.id!}
          onUpdateLayer={handleUpdateLayer}
        />
      ))}
    </div>
  )
}
