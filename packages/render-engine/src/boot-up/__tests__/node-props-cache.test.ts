import NodePropsCache from '../node-props-cache';

test('inherited_node_props_should_return_empty_object', () => {
  const hub = new NodePropsCache(new Set());

  expect(hub.getProps$('some_node_path', 0)?.value).toEqual({});
});

test('inherited_node_props_hub_resolve_expected_value', () => {
  const cacheIDs: Set<string> = new Set();
  cacheIDs.add('parent_path');
  const hub = new NodePropsCache(cacheIDs);

  expect(hub.hasCacheID('parent_path')).toBeTruthy();

  hub.setProps('ROOT/parent_path', 'parent_path','another_value');
  hub.setProps('ROOT/parent_path_not_cache', 'parent_path_not_cache', 'another_value');
  expect(hub.getProps$('ROOT/parent_path/some_node_id', 0)?.value).toEqual('another_value');
  expect(hub.getProps$('ROOT/parent_path_not_cache/some_not_cached_node_id', 0)?.value).toEqual({});
});

test('loop_node_inherited_props_hub_resolve_expected_value', () => {
  const cacheIDs: Set<string> = new Set();
  cacheIDs.add('parent_path');
  const hub = new NodePropsCache(cacheIDs);

  expect(hub.hasCacheID('parent_path')).toBeTruthy();

  hub.setProps('ROOT/parent_path/0', 'some_node_id','another_value');
  hub.setProps('ROOT/parent_path_not_cache/0', 'some_not_cached_node_id' ,'another_value');
  expect(hub.getProps$('ROOT/parent_path/0/some_node_id', 0)?.value).toEqual('another_value');
  expect(hub.getProps$('ROOT/parent_path_not_cache/0/some_not_cached_node_id', 0)?.value).toEqual({});
});
