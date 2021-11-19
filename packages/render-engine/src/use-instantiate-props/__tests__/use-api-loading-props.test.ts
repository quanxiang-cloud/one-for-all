import { act, renderHook } from '@testing-library/react-hooks/pure';
import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import useAPILoadingProps from '../use-api-loading-props';
import APIStatesHub from '../../ctx/api-states-hub';
import { SchemaNode, NodePropType, Instantiated } from '../../types';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const stateIDMap = {
  some_api_state: { apiID: 'get:/api' },
};

test('useAPILoadingProps_resolve_expected_values', () => {
  const apiStateHub = new APIStatesHub(apiSpecAdapter, stateIDMap);
  dummyCTX.apiStates = apiStateHub;

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      loading: {
        type: NodePropType.APILoadingProperty,
        stateID: 'some_api_state',
      },
    },
  };

  const { result, unmount } = renderHook(() => useAPILoadingProps(node, dummyCTX));
  expect(result.current.loading).toBe(false);

  act(() => {
    apiStateHub.getState('some_api_state').next({
      data: undefined,
      error: undefined,
      loading: true,
    });
  });

  expect(result.current.loading).toBe(true);

  unmount();
});
