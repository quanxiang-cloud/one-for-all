import React, { useMemo } from 'react';
import { ShadowNode } from '../types';

export default function useShadowNodeStyle({ depth, absolutePosition }: ShadowNode): React.CSSProperties {
  const { height, width, x, y } = absolutePosition;
  return useMemo(() => {
    return {
      zIndex: depth,
      height: absolutePosition.height,
      width: absolutePosition.width,
      transform: `translate(${absolutePosition.x}px, ${absolutePosition.y}px)`,
    };
  }, [height, width, x, y, depth]);
}
