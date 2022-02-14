import React, { useState, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';

export interface DropIndicatorProps {
  rowHeight: number
  indent: number
  dropOverClassName?: string
  dropBetweenClassName?: string
}

export type DropIndicatorHandles = {
  setIndicatorState: React.Dispatch<React.SetStateAction<DropIndicatorState>>
  clearIndicatorState(): void
}

export interface DropIndicatorState {
  type: 'none' | 'over' | 'between' | string;
  index: number
  depth: number
}

function DropIndicator({
  rowHeight,
  indent,
  dropOverClassName,
  dropBetweenClassName,
}: DropIndicatorProps,
ref: React.Ref<DropIndicatorHandles> | undefined): JSX.Element {
  const [indicatorState, setIndicatorState] = useState<DropIndicatorState>({
    type: 'none',
    index: 0,
    depth: 0,
  });
  const offset = indicatorState.index * rowHeight;

  function clearIndicatorState(): void {
    setIndicatorState({
      type: 'none',
      index: 0,
      depth: 0,
    });
  }

  useImperativeHandle(ref, () => ({
    setIndicatorState,
    clearIndicatorState,
  }));

  return (
    <div title={indicatorState.depth.toString()}>
      <div
        style={{
          width: `calc(100% - ${(indicatorState.depth ) * indent}px)`,
          height: indicatorState.type === 'over' ? rowHeight : 0,
          transform: `translate(${indicatorState.depth * indent}px, ${offset}px)`,
          borderWidth: indicatorState.type === 'between' ? 1 : 2,
        }}
        hidden={indicatorState.type === 'none'}
        className={classNames('page-tree-node-indicator',
          {
            [`${dropOverClassName}`]: indicatorState.type === 'over',
            [`${dropBetweenClassName}`]: indicatorState.type === 'between',
          },
        )}
      />
    </div>
  );
}

export default forwardRef(DropIndicator);
