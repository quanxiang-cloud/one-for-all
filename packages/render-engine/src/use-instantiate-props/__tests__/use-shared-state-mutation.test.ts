import { renderHook, act } from '@testing-library/react-hooks/pure';

import { NodePropType, Instantiated, SchemaNode } from '../../types';

import SharedStatesHub from '../../ctx/shared-states-hub';
import useSharedStateMutationProps from '../use-shared-state-mutation';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

test('useSharedStateMutationProps_resolve_raw_data_when_adapter_is_undefined', () => {
  const sharedStates = new SharedStatesHub({});
  dummyCTX.sharedStates = sharedStates;

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      onChange: {
        type: NodePropType.SharedStateMutationProperty,
        stateID: 'some_value',
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateMutationProps(node, dummyCTX));

  act(() => {
    result.current.onChange(1);
  });
  expect(sharedStates.getState$('some_value').getValue()).toEqual(1);

  act(() => {
    result.current.onChange('foo');
  });
  expect(sharedStates.getState$('some_value').getValue()).toEqual('foo');

  act(() => {
    result.current.onChange(undefined);
  });
  expect(sharedStates.getState$('some_value').getValue()).toBeUndefined();

  unmount();
});

test('useSharedStateMutationProps_should_not_mutate_state_when_adapter_throw', () => {
  const sharedStates = new SharedStatesHub({
    some_value: { initial: 'some_value' },
  });
  dummyCTX.sharedStates = sharedStates;
  // eslint-disable-next-line no-console
  console.error = jest.fn();
  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      onChange: {
        type: NodePropType.SharedStateMutationProperty,
        stateID: 'some_value',
        adapter: () => {
          throw new Error('should be handled');
        },
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateMutationProps(node, dummyCTX));

  act(() => {
    result.current.onChange(1);
  });

  expect(sharedStates.getState$('some_value').getValue()).toEqual('some_value');
  // eslint-disable-next-line no-console
  expect(console.error).toBeCalled();

  unmount();
});

test('useSharedStateMutationProps_should_resolve_adapter_returned', () => {
  const sharedStates = new SharedStatesHub({
    some_value: { initial: 'some_value' },
  });
  dummyCTX.sharedStates = sharedStates;
  // eslint-disable-next-line no-console
  console.error = jest.fn();
  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      onChange: {
        type: NodePropType.SharedStateMutationProperty,
        stateID: 'some_value',
        adapter: () => 'another_value',
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateMutationProps(node, dummyCTX));

  act(() => {
    result.current.onChange(1);
  });

  expect(sharedStates.getState$('some_value').getValue()).toEqual('another_value');
  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();

  unmount();
});

test('useSharedStateMutationProps_should_call_adapter_correctly', () => {
  const sharedStates = new SharedStatesHub({
    some_value: { initial: 'some_value' },
  });
  dummyCTX.sharedStates = sharedStates;
  const adapterMock = jest.fn(() => 'another_value');
  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      onChange: {
        type: NodePropType.SharedStateMutationProperty,
        stateID: 'some_value',
        adapter: adapterMock,
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateMutationProps(node, dummyCTX));

  act(() => {
    result.current.onChange({ foo: 'bar' });
  });

  expect(sharedStates.getState$('some_value').getValue()).toEqual('another_value');
  expect(adapterMock).toBeCalledWith({ foo: 'bar' });

  unmount();
});
