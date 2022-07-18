import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import type { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import { logger } from '@one-for-all/utils';

import { CTXContext } from '../../use-ctx';
import useAPIResultProps from '../use-api-result-props';
import StatesHubAPI from '../../boot-up/states-hub-api';
import { ArteryNode } from '../../types';
import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const stateIDMap = {
  some_api_state: { apiID: 'get:/api' },
  another_api_state: { apiID: 'get:/api' },
};

describe('useAPIResultProps_resolve_expected_fallback', () => {
  test('when_it_is_the_initial_state', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });
    expect(result.current.foo).toBe(fallback);

    unmount();
  });

  test('when_api_return_error', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });
    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: undefined,
        error: new Error('should be handled'),
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toBe(fallback);
    expect(result.all.length).toBe(1);

    // expect return latest not-nullish fallback
    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: 'some_new_data',
        error: undefined,
        loading: false,
      });

      apiStateHub.getState$('some_api_state').next({
        result: undefined,
        error: new Error('should be handled'),
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toBe('some_new_data');
    // the last call of next will not resolve new result
    // so result.all.length is 2
    expect(result.all.length).toBe(2);

    unmount();
  });

  test('when_adapter_throw', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: (shouldThrow: unknown): unknown => {
            if (shouldThrow) {
              throw new Error('should be handled');
            }

            return shouldThrow;
          },
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });
    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: true,
        error: undefined,
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toEqual(fallback);
    expect(result.all.length).toBe(2);

    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: false,
        error: undefined,
        loading: false,
      });

      apiStateHub.getState$('some_api_state').next({
        result: true,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(false);

    expect(logger.error).toBeCalled();

    unmount();
  });

  test('when_adapter_return_undefined', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: () => {
            return;
          },
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });
    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: { foo: 'bar' },
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toMatchObject(fallback);
    expect(result.all.length).toBe(2);

    unmount();
  });

  test('when_data_is_undefined', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });
    const latestFallback = { bar: 'baz' };
    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: latestFallback,
        error: undefined,
        loading: false,
      });
      apiStateHub.getState$('some_api_state').next({
        result: undefined,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(latestFallback);

    unmount();
  });
});

describe('useAPIResultProps_should_call_adapter_correctly', () => {
  test('do_not_call_on_initial_stage', () => {
    const adapter = jest.fn();
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: adapter,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });

    expect(result.current.foo).toEqual(fallback);
    expect(adapter).not.toBeCalled();

    unmount();
  });

  test('do_not_call_when_data_is_undefined', () => {
    const adapter = jest.fn();
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: adapter,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });

    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: undefined,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(fallback);
    expect(adapter).not.toBeCalled();

    unmount();
  });

  test('do_call_when_data_is_not_nullish', () => {
    const adapter = jest.fn((v) => v);
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: adapter,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });

    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: { bar: 'baz' },
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual({ bar: 'baz' });
    expect(adapter).toBeCalledWith({ bar: 'baz' });

    unmount();
  });

  test('return_expected_value', () => {
    const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
    dummyCTX.statesHubAPI = apiStateHub;
    const fallback = { foo: 123 };
    const node: ArteryNode = {
      id: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: 'api_result_property',
          fallback: fallback,
          stateID: 'some_api_state',
          convertor: (v) => (v as number) * 2,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });

    act(() => {
      apiStateHub.getState$('some_api_state').next({
        result: 2,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(4);

    unmount();
  });
});

test('useAPIResultProps_resolve_expected_value', () => {
  const apiStateHub = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: stateIDMap });
  dummyCTX.statesHubAPI = apiStateHub;

  const node: ArteryNode = {
    id: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      foo: {
        type: 'api_result_property',
        fallback: { foo: 'bar' },
        stateID: 'some_api_state',
      },
      bar: {
        type: 'api_result_property',
        fallback: { bar: 'baz' },
        stateID: 'another_api_state',
      },
    },
  };
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

  const { result, unmount } = renderHook(() => useAPIResultProps(node), { wrapper });

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: 'some_api_state',
      error: undefined,
      loading: false,
    });
  });

  act(() => {
    apiStateHub.getState$('another_api_state').next({
      result: 'another_api_state',
      error: undefined,
      loading: false,
    });
  });

  expect(result.current.foo).toEqual('some_api_state');
  expect(result.current.bar).toEqual('another_api_state');
  expect(result.all.length).toBe(3);

  unmount();
});
