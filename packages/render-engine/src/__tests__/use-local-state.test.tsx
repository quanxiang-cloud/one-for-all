import { renderHook, act } from '@testing-library/react-hooks';

import { useLocalState, useSetLocalState } from '../use-local-state';

const stateID = 'some_local_state';

test('use_local_state_resolve_undefined', () => {
  const { result } = renderHook(() => useLocalState(stateID));

  expect(result.current).toBeUndefined();
});

test('use_local_state_resolve_initial_value', () => {
  const initialValue = 'initial_value';
  const secondValue = 'second_value';
  const { result } = renderHook(() => useLocalState(stateID, initialValue));

  expect(result.current).toEqual(initialValue);

  act(() => {
    renderHook(() => useSetLocalState(stateID)).result.current(secondValue);
  });

  expect(result.current).toEqual(secondValue);

  const newResult = renderHook(() => useLocalState(stateID, initialValue)).result.current;
  expect(newResult).toEqual(secondValue);
});
