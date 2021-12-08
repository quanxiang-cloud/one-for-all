import { renderHook } from '@testing-library/react-hooks/pure';

import { Instantiated, SchemaNode, NodeType } from '../../types';
import SharedStateHub from '../../ctx/states-hub-shared';
import useInternalHooks from '../use-internal-hook-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

test('useInternalHooks_resolve_expected_value', () => {
  const hub = new SharedStateHub({});
  dummyCTX.statesHubShared = hub;
  const nodeID = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  const node: SchemaNode<Instantiated> = {
    id: nodeID,
    type: NodeType.ReactComponentNode,
    packageName: 'whatever',
    packageVersion: 'whatever',
    exportName: '',
    supportStateExposure: true,
    props: {},
  };

  const { result, unmount } = renderHook(() => useInternalHooks(node, dummyCTX));

  result.current.__exposeState?.(someNodeInternalState);
  expect(hub.retrieveNodeState(nodeID)).toEqual(someNodeInternalState);

  result.current.__exposeState?.(123);
  expect(hub.retrieveNodeState(nodeID)).toEqual(123);

  unmount();
});
