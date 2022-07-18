import NodePropsCache from '../node-props-cache';

test('inherited_node_props_should_return_empty_object', () => {
  const hub = new NodePropsCache(new Set());

  expect(hub.getProps$('some_node_path')?.value).toEqual({});
});

test('inherited_node_props_hub_resolve_expected_value', () => {
  const cacheIDs: Set<string> = new Set();
  cacheIDs.add('parentID');
  const hub = new NodePropsCache(cacheIDs);

  expect(hub.shouldCache('parentID')).toBeTruthy();

  hub.setProps('ROOT/parentID', 'parentID', { someValue: 1 });
  hub.setProps('ROOT/parentID_not_cache', 'parentID_not_cache', { someValue: 1 });
  expect(hub.getProps$('parentID')?.value).toEqual({ someValue: 1 });
  expect(hub.getProps$('parentID_not_cache')?.value).toEqual({});
});

test('loop_node_inherited_props_hub_resolve_expected_value', () => {
  const cacheIDs: Set<string> = new Set();
  cacheIDs.add('parentID');
  cacheIDs.add('otherParentID');
  const hub = new NodePropsCache(cacheIDs);

  expect(hub.shouldCache('parentID')).toBeTruthy();

  hub.setProps('ROOT/parentID/0', 'parentID', { someValue: 1 });
  hub.setProps('ROOT/parentID_not_cache/0', 'parentID_not_cache', { someValue: 1 });

  hub.setProps('ROOT/parentID/4/otherParentID', 'otherParentID', { someValue: 1 });
  hub.setProps('ROOT/parentID_not_cache/4/some_otherParentID', 'some_otherParentID', { someValue: 1 });
  expect(hub.getProps$('parentID')?.value).toEqual({ someValue: 1 });
  expect(hub.getProps$('parentID_not_cache')?.value).toEqual({});
  expect(hub.getProps$('otherParentID')?.value).toEqual({ someValue: 1 });
  expect(hub.getProps$('some_otherParentID')?.value).toEqual({});
});
