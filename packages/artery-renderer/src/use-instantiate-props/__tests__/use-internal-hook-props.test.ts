import React from 'react';
import { renderHook } from '@testing-library/react-hooks/pure';

import { ArteryNode } from '../../types';
import StatesHubShared from '../../boot-up/states-hub-shared';
import useInternalHooks from '../use-internal-hook-props';
import { CTXContext } from '../../use-ctx';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';

test('useInternalHooks_resolve_expected_value', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeID = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  const node: ArteryNode = {
    id: nodeID,
    type: 'react-component',
    packageName: 'whatever',
    packageVersion: 'whatever',
    exportName: '',
    supportStateExposure: true,
    props: {},
  };

  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useInternalHooks(node), { wrapper });

  result.current.__exposeState?.(someNodeInternalState);
  expect(hub.getNodeState$(`ROOT/${nodeID}`).value).toEqual(someNodeInternalState);

  result.current.__exposeState?.(123);
  expect(hub.getNodeState$(`ROOT/${nodeID}`).value).toEqual(123);

  unmount();
});
