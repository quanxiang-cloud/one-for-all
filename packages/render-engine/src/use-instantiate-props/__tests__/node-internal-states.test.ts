import { renderHook } from '@testing-library/react-hooks/pure';
import { ComponentPropType, Instantiated, SchemaNode } from '../../types';
import NodeInternalStates from '../../ctx/node-internal-states';
import useInternalNodeStates from '../use-node-state-props';
import useInternalHooks from '../use-internal-hook-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

test('node_state_should_return_undefined', () => {
  const hub = new NodeInternalStates();

  expect(hub.retrieve('some_node_id')).toBeUndefined();
});

test('node_state_hub_resolve_expected_value', () => {
  const hub = new NodeInternalStates();
  dummyCTX.nodeInternalStates = hub;

  hub.expose('some_node_id', 'some_internal_state');
  expect(hub.retrieve('some_node_id')).toEqual('some_internal_state');

  hub.expose('some_node_id', 'another_value');
  expect(hub.retrieve('some_node_id')).toEqual('another_value');
});

test('node_expose_internal_state', () => {
  const hub = new NodeInternalStates();
  dummyCTX.nodeInternalStates = hub;
  const nodeID = 'node_id';
  const internalState = { foo: 'bar' };
  const node: SchemaNode<Instantiated> = {
    key: nodeID,
    type: 'html-element',
    name: 'div',
    props: {},
    supportStateExposure: true,
  };

  const { result, unmount } = renderHook(() => useInternalHooks(node, dummyCTX));
  result.current.__exposeState?.(internalState);

  expect(hub.retrieve(nodeID)).toEqual(internalState);
  unmount();
});

test('resolve_expected_node_internal_state', () => {
  const hub = new NodeInternalStates();
  dummyCTX.nodeInternalStates = hub;
  const nodeID = 'node_id';
  const internalState = { foo: 'bar' };

  hub.expose(nodeID, internalState);
  const node: SchemaNode<Instantiated> = {
    key: nodeID,
    type: 'html-element',
    name: 'div',
    props: {
      anotherNodeState: {
        type: ComponentPropType.NodeStateProperty,
        nodeKey: nodeID,
        fallback: false,
      },
    },
  };

  const { result, unmount } = renderHook(() => useInternalNodeStates(node, dummyCTX));
  expect(result.current.anotherNodeState).toEqual(internalState);

  unmount();
});
