import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';

import { CTXContext } from '../../use-ctx';
import useAPILoadingProps from '../use-api-loading-props';
import StatesHubAPI from '../../boot-up/states-hub-api';
import { ArteryNode } from '../../types';
import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const stateIDMap = {
  some_api_state: { apiID: 'get:/api' },
};

test('useAPILoadingProps_resolve_expected_values', () => {
  const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
  dummyCTX.statesHubAPI = apiStateHub;

  const node: ArteryNode = {
    id: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      loading: {
        type: 'api_loading_property',
        stateID: 'some_api_state',
      },
    },
  };
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

  const { result, unmount } = renderHook(() => useAPILoadingProps(node), { wrapper });

  expect(result.current.loading).toBe(false);

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: undefined,
      error: undefined,
      loading: true,
    });
  });

  expect(result.current.loading).toBe(true);

  unmount();
});
