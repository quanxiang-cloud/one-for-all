import NodeStateHub from '../states-hub-shared';

test('node_state_should_return_undefined', () => {
  const hub = new NodeStateHub({});

  expect(hub.retrieveNodeState('some_node_id')).toBeUndefined();
});

test('node_state_hub_resolve_expected_value', () => {
  const hub = new NodeStateHub({});

  hub.exposeNodeState('some_node_id', 'some_internal_state');
  expect(hub.retrieveNodeState('some_node_id')).toEqual('some_internal_state');

  hub.exposeNodeState('some_node_id', 'another_value');
  expect(hub.retrieveNodeState('some_node_id')).toEqual('another_value');
});
