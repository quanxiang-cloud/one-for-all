import { renderHook } from '@testing-library/react-hooks/pure';

import { SchemaNode } from '../../types';
import StatesHubShared from '../../ctx/states-hub-shared';
import useInternalHooks from '../use-internal-hook-props';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

test('useInternalHooks_resolve_expected_value', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeID = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  const node: SchemaNode = {
    id: nodeID,
    type: 'react-component',
    packageName: 'whatever',
    packageVersion: 'whatever',
    exportName: '',
    supportStateExposure: true,
    props: {},
  };

  const { result, unmount } = renderHook(() => useInternalHooks(node, dummyCTX));

  result.current.__exposeState?.(someNodeInternalState);
  expect(hub.getNodeState$(nodeID).value).toEqual(someNodeInternalState);

  result.current.__exposeState?.(123);
  expect(hub.getNodeState$(nodeID).value).toEqual(123);

  unmount();
});
