import NodeStateHub from '../states-hub-shared';

test('node_state_should_return_undefined', () => {
  const hub = new NodeStateHub({});

  expect(hub.getNodeState$('some_node_id').value).toBeUndefined();
});

test('node_state_hub_resolve_expected_value', () => {
  const hub = new NodeStateHub({});

  hub.exposeNodeState('some_node_id', 'some_internal_state');
  expect(hub.getNodeState$('some_node_id').value).toEqual('some_internal_state');

  hub.exposeNodeState('some_node_id', 'another_value');
  expect(hub.getNodeState$('some_node_id').value).toEqual('another_value');
});

test('node_state_hub_resolve_obj_value', () => {
  const hub = new NodeStateHub({});
  const func = jest.fn();

  hub.exposeNodeState('some_node_id', func);
  const getFunc = hub.getNodeState$('some_node_id').value;
  (getFunc as Function)();

  expect(func).toHaveBeenCalled();
});
