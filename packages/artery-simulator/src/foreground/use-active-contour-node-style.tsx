import React, { useMemo } from 'react';
import { ContourNode } from '../types';

export default function useContourNodeStyle({ depth, absolutePosition }: ContourNode): React.CSSProperties {
  const { height, width, x, y } = absolutePosition;
  return useMemo(() => {
    return {
      zIndex: depth,
      height: height,
      width: width,
      transform: `translate(${x}px, ${y}px)`,
    };
  }, [height, width, x, y, depth]);
}
