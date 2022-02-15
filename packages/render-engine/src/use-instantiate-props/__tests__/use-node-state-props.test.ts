import { noop } from 'rxjs';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import { logger } from '@one-for-all/utils';

import { SchemaNode } from '../../types';
import StatesHubShared from '../../ctx/states-hub-shared';
import useSharedStateProps from '../use-shared-state-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

describe('useNodeStateProps_resolve_expected_value', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeKey = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  hub.exposeNodeState(nodeKey, someNodeInternalState);

  test('resolve_fallback_value_when_node_state_is_undefined', () => {
    const node: SchemaNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: 'some_node_key_which_does_not_exist',
          fallback: '123',
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual('123');

    unmount();
  });

  test('resolve_untouched_node_state_when_no_adapter', () => {
    const node: SchemaNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(someNodeInternalState);

    unmount();
  });

  test('resolve_fallback_when_adapter_throw', () => {
    const node: SchemaNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: () => {
            throw new Error('should be handled');
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(false);
    expect(logger.error).toBeCalled();

    unmount();
  });

  test('resolve_fallback_when_adapter_return_undefined', () => {
    const node: SchemaNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: noop,
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(false);
    expect(logger.error).not.toBeCalled();

    unmount();
  });

  test('resolve_converted_value', () => {
    const node: SchemaNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: () => 'bar',
        },
      },
    };

    const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

    expect(result.current.anotherNodeState).toEqual('bar');

    unmount();
  });
});

test('useNodeStateProps_should_resolve_after_changed', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeKey = 'node_id';
  const node: SchemaNode = {
    id: 'foo',
    type: 'html-element',
    name: 'div',
    props: {
      anotherNodeState: {
        type: 'node_state_property',
        nodePath: nodeKey,
        fallback: false,
      },
    },
  };

  const { result, unmount } = renderHook(() => useSharedStateProps(node, dummyCTX));

  expect(result.current.anotherNodeState).toEqual(false);

  act(() => hub.exposeNodeState(nodeKey, 'foo'));
  expect(result.current.anotherNodeState).toEqual('foo');

  act(() => hub.exposeNodeState(nodeKey, 'bar'));
  expect(result.current.anotherNodeState).toEqual('bar');

  act(() => hub.exposeNodeState(nodeKey, undefined));
  expect(result.current.anotherNodeState).toEqual('bar');

  unmount();
});
