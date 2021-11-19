import { noop } from 'lodash';
import { act, renderHook } from '@testing-library/react-hooks/pure';

import { NodePropType, Instantiated, SchemaNode } from '../../types';
import NodeStateHub from '../../ctx/node-state-hub';
import useNodeStateProps from '../use-node-state-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

describe('useNodeStateProps_resolve_expected_value', () => {
  const hub = new NodeStateHub();
  dummyCTX.nodeStates = hub;
  const nodeKey = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  hub.expose(nodeKey, someNodeInternalState);

  test('resolve_fallback_value_when_node_state_is_undefined', () => {
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: NodePropType.NodeStateProperty,
          nodeKey: 'some_node_key_which_does_not_exist',
          fallback: '123',
        },
      },
    };

    const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual('123');

    unmount();
  });

  test('resolve_untouched_node_state_when_no_adapter', () => {
    const node: SchemaNode<Instantiated> = {
      key: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: NodePropType.NodeStateProperty,
          nodeKey: nodeKey,
          fallback: false,
        },
      },
    };

    const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(someNodeInternalState);

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
        anotherNodeState: {
          type: NodePropType.NodeStateProperty,
          nodeKey: nodeKey,
          fallback: false,
          convertor: () => {
            throw new Error('should be handled');
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(false);
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
        anotherNodeState: {
          type: NodePropType.NodeStateProperty,
          nodeKey: nodeKey,
          fallback: false,
          convertor: noop,
        },
      },
    };

    const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));
    expect(result.current.anotherNodeState).toEqual(false);
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
        anotherNodeState: {
          type: NodePropType.NodeStateProperty,
          nodeKey: nodeKey,
          fallback: false,
          convertor: () => 'bar',
        },
      },
    };

    const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));

    expect(result.current.anotherNodeState).toEqual('bar');

    unmount();
  });
});

test('useNodeStateProps_should_resolve_after_changed', () => {
  const hub = new NodeStateHub();
  dummyCTX.nodeStates = hub;
  const nodeKey = 'node_id';
  const node: SchemaNode<Instantiated> = {
    key: 'foo',
    type: 'html-element',
    name: 'div',
    props: {
      anotherNodeState: {
        type: NodePropType.NodeStateProperty,
        nodeKey: nodeKey,
        fallback: false,
      },
    },
  };

  const { result, unmount } = renderHook(() => useNodeStateProps(node, dummyCTX));

  expect(result.current.anotherNodeState).toEqual(false);

  act(() => hub.expose(nodeKey, 'foo'));
  expect(result.current.anotherNodeState).toEqual('foo');

  act(() => hub.expose(nodeKey, 'bar'));
  expect(result.current.anotherNodeState).toEqual('bar');

  act(() => hub.expose(nodeKey, undefined));
  expect(result.current.anotherNodeState).toEqual('bar');

  unmount();
});
