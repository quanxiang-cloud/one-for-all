import NodePropsCache from '../node-props-cache';

test('node_state_should_return_empty_object', () => {
  const hub = new NodePropsCache([]);

  expect(hub.getProps$('some_node_id.propName')?.value).toEqual({});
});

test('node_state_hub_resolve_expected_value', () => {
  const hub = new NodePropsCache([]);

  hub.addCacheKey('some_node_id.propName');
  expect(hub.hasCacheKey('some_node_id.propName')).toBeTruthy();

  hub.setProps('some_node_id.propName', 'another_value');
  expect(hub.getProps$('some_node_id.propName')?.value).toEqual('another_value');
});
