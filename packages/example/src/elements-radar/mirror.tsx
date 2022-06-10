import { Rect } from '@one-for-all/elements-radar';
import React, { useImperativeHandle, useState, useEffect, useRef, Ref } from 'react';

interface Props {
  mirrors: Array<{ id: string; rect: Rect }>;
  scrollSize: { height: number; width: number };
  onScroll: (position: { x: number; y: number }) => void;
}

function debounceAnimationFrame<F extends (...args: any[]) => any>(fn: F) {
  let timeout: number;
  const debouncedFn = (...args: Parameters<F>) => {
    cancelAnimationFrame(timeout);
    return new Promise<ReturnType<F>>((resolve) => {
      timeout = requestAnimationFrame(() => {
        const result: ReturnType<F> = fn(...args);
        resolve(result);
      });
    });
  };

  return debouncedFn;
}

function Mirror({ mirrors, scrollSize, onScroll }: Props): JSX.Element {
  function handleScroll(e: any) {
    onScroll({ x: e.target.scrollLeft, y: e.target.scrollTop });
  }

  return (
    <div className="mirror-root" onScroll={debounceAnimationFrame(handleScroll)}>
      <div
        className="mirror-scroll"
        style={{ height: `${scrollSize.height}px`, width: `${scrollSize.width}px` }}
      >
        {mirrors.map(({ id, rect }) => {
          const style: React.CSSProperties = {
            height: rect.height,
            width: rect.width,
            transform: `translate(${rect.x}px, ${rect.y}px)`,
          };

          return (
            <div key={id} style={style} className="mirror-cell">
              {id}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Mirror;
