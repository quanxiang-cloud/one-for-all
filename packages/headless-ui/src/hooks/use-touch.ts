import { useCallback, useRef } from 'react';

import useSetState from './use-set-state';

const MIN_DISTANCE = 10;

type Direction = '' | 'vertical' | 'horizontal';

function getDirection(x: number, y: number): Direction {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }
  return '';
}

const INITIAL_STATE = {
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
  offsetX: 0,
  offsetY: 0,
  direction: '' as Direction,
};

type State = (typeof INITIAL_STATE) & Record<string, unknown>;

type Touch = State & {
  move: EventListener;
  start: EventListener;
  reset: () => void;
  isVertical: () => boolean;
  isHorizontal: () => boolean;
}

type StateType = Partial<typeof INITIAL_STATE>;
type StateFunctionType = (value: StateType) => typeof INITIAL_STATE;

const useTouch = (canState?: boolean): Touch => {
  const refState = useRef<State>(INITIAL_STATE);
  const state = useSetState(INITIAL_STATE);

  const innerState = canState ? state[0] : refState.current;

  const update = (value: StateType | StateFunctionType): void => {
    if (canState) {
      state[1](value);
      return;
    }
    let _value = value;
    if (typeof value === 'function') {
      _value = value(refState.current);
    }
    Object.entries(_value).forEach(([k, v]) => {
      refState.current[k] = v;
    });
  };

  const isVertical = useCallback(() => innerState.direction === 'vertical', [innerState.direction]);
  const isHorizontal = useCallback(
    () => innerState.direction === 'horizontal',
    [innerState.direction],
  );

  const reset = (): void => {
    update({
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      direction: '',
    });
  };

  const start = ((event: TouchEvent) => {
    reset();
    update({
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
    });
  }) as EventListener;

  const move = ((event: TouchEvent) => {
    const touch = event.touches[0];

    update((value) => {
      // Fix: Safari back will set clientX to negative number
      const newState = { ...value } as typeof innerState;

      newState.deltaX = touch.clientX < 0 ? 0 : touch.clientX - newState.startX;
      newState.deltaY = touch.clientY - newState.startY;
      newState.offsetX = Math.abs(newState.deltaX);
      newState.offsetY = Math.abs(newState.deltaY);

      if (!newState.direction) {
        newState.direction = getDirection(newState.offsetX, newState.offsetY);
      }
      return newState;
    });
  }) as EventListener;

  return {
    ...innerState,
    move,
    start,
    reset,
    isVertical,
    isHorizontal,
  };
};

export default useTouch;
