import { noop } from 'lodash';
import { renderHook, act } from '@testing-library/react-hooks/pure';

import { NodePropType, Instantiated, SchemaNode } from '../../types';
import useSharedStateProps from '../use-shared-state-props';
import SharedStatesHub from '../../ctx/shared-states-hub';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

describe('useSharedStateProps_resolve_expected_value', () => {
  const sharedStates = new SharedStatesHub({
    the_only_pre_defined_value: { initial: 'the_only_pre_defined_value' },
  });
  dummyCTX.sharedStates = sharedStates;

  test('resolve_fallback_when_state_is_undefined', () => {
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.SharedStateProperty,
          stateID: 'some_state_does_not_exist',
          fallback: 'foo',
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.foo).toEqual('foo');
    unmount();
  });

  test('resolve_current_value', () => {
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.SharedStateProperty,
          stateID: 'the_only_pre_defined_value',
          fallback: 'foo',
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.foo).toEqual('the_only_pre_defined_value');

    unmount();
  });

  test('resolve_fallback_when_adapter_throw', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.SharedStateProperty,
          stateID: 'the_only_pre_defined_value',
          fallback: 'foo',
          adapter: () => {
            throw new Error('should be handled');
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.foo).toEqual('foo');
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();

    unmount();
  });

  test('resolve_fallback_when_adapter_return_undefined', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.SharedStateProperty,
          stateID: 'the_only_pre_defined_value',
          fallback: 'foo',
          adapter: noop,
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.foo).toEqual('foo');
    // eslint-disable-next-line no-console
    expect(console.error).not.toBeCalled();

    unmount();
  });

  test('resolve_converted_value', () => {
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.SharedStateProperty,
          stateID: 'the_only_pre_defined_value',
          fallback: 'foo',
          adapter: () => 'bar',
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.foo).toEqual('bar');

    unmount();
  });
});

describe('useSharedStateProps_call_adapter_correctly', () => {
  const sharedStates = new SharedStatesHub({
    the_only_pre_defined_value: { initial: 'the_only_pre_defined_value' },
  });
  dummyCTX.sharedStates = sharedStates;
  const adapterMock = jest.fn();

  const node: SchemaNode<Instantiated> = {
    key: 'foo',
    type: 'html-element',
    name: 'div',
    props: {
      foo: {
        type: NodePropType.SharedStateProperty,
        stateID: 'the_only_pre_defined_value',
        fallback: 'foo',
        adapter: adapterMock,
      },
    },
  };

  const { unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

  expect(adapterMock).toBeCalledTimes(1);
  expect(adapterMock).toBeCalledWith('the_only_pre_defined_value');

  unmount();
});

test('useSharedStateProps_resolve_values_after_changed', () => {
  const sharedStates = new SharedStatesHub({
    the_only_pre_defined_value: { initial: 'the_only_pre_defined_value' },
  });
  dummyCTX.sharedStates = sharedStates;

  const node: SchemaNode<Instantiated> = {
    key: 'foo',
    type: 'html-element',
    name: 'div',
    props: {
      foo: {
        type: NodePropType.SharedStateProperty,
        stateID: 'the_only_pre_defined_value',
        fallback: 'foo',
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

  expect(result.current.foo).toEqual('the_only_pre_defined_value');

  act(() => {
    sharedStates.getState$('the_only_pre_defined_value').next(true);
  });
  expect(result.current.foo).toEqual(true);

  act(() => {
    sharedStates.getState$('the_only_pre_defined_value').next('some_value');
  });
  expect(result.current.foo).toEqual('some_value');

  act(() => {
    sharedStates.getState$('the_only_pre_defined_value').next(undefined);
  });
  expect(result.current.foo).toEqual('some_value');

  unmount();
});
