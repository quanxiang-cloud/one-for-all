import { renderHook } from '@testing-library/react-hooks/pure';

import { Instantiated, SchemaNode } from '../../types';
import NodeStateHub from '../../ctx/node-state-hub';
import useInternalHooks from '../use-internal-hook-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

test('useInternalHooks_resolve_expected_value', () => {
  const hub = new NodeStateHub();
  dummyCTX.nodeStates = hub;
  const nodeID = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  const node: SchemaNode<Instantiated> = {
    key: nodeID,
    type: 'html-element',
    name: 'div',
    props: {},
    supportStateExposure: true,
  };

  const { result, unmount } = renderHook(() => useInternalHooks(node, dummyCTX));

  result.current.__exposeState?.(someNodeInternalState);
  expect(hub.retrieve(nodeID)).toEqual(someNodeInternalState);

  result.current.__exposeState?.(123);
  expect(hub.retrieve(nodeID)).toEqual(123);

  unmount();
});
