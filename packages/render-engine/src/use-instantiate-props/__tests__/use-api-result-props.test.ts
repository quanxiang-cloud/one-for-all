import mockXHR from 'xhr-mock';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import type { Adapter } from '@ofa/api-spec-adapter';

import useAPIResultProps from '../use-api-result-props';
import APIStateHub from '../../ctx/api-state-hub';
import { SchemaNode, NodePropType, Instantiated } from '../../types';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const builder: Adapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const stateIDMap = {
  some_api_state: { apiID: 'get:/api' },
};

describe('useAPIResultProps_resolve_expected_fallback', () => {
  test('when_it_is_the_initial_state', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    expect(result.current.foo).toBe(fallback);

    unmount();
  });

  test('when_api_return_error', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: undefined,
        error: new Error('should be handled'),
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toBe(fallback);
    expect(result.all.length).toBe(2);

    // expect return latest not-nullish fallback
    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: 'some_new_data',
        error: undefined,
        loading: false,
      });

      apiStateHub.getState('some_api_state').next({
        data: undefined,
        error: new Error('should be handled'),
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toBe('some_new_data');
    // the last call of next will not resolve new result
    // so result.all.length is 3
    expect(result.all.length).toBe(3);

    unmount();
  });

  test('when_adapter_throw', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: (shouldThrow: boolean) => {
            if (shouldThrow) {
              throw new Error('should be handled');
            }

            return shouldThrow;
          },
        },
      },
    };

    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: true,
        error: undefined,
        loading: false,
      });
    });

    // expect return fallback defined in schema
    expect(result.current.foo).toEqual(fallback);
    expect(result.all.length).toBe(2);

    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: false,
        error: undefined,
        loading: false,
      });

      apiStateHub.getState('some_api_state').next({
        data: true,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(false);

    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();

    unmount();
  });

  test('when_adapter_return_undefined', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: () => {
            return;
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: { foo: 'bar' },
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toMatchObject(fallback);
    expect(result.all.length).toBe(2);

    unmount();
  });

  test('when_data_is_undefined', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
        },
      },
    };

    const latestFallback = { bar: 'baz' };
    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: latestFallback,
        error: undefined,
        loading: false,
      });
      apiStateHub.getState('some_api_state').next({
        data: undefined,
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
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: adapter,
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));

    expect(result.current.foo).toEqual(fallback);
    expect(adapter).not.toBeCalled();

    unmount();
  });

  test('do_not_call_when_data_is_undefined', () => {
    const adapter = jest.fn();
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: adapter,
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));

    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: undefined,
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
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: adapter,
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));

    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: { bar: 'baz' },
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual({ bar: 'baz' });
    expect(adapter).toBeCalledWith({ bar: 'baz' });

    unmount();
  });

  test('return_expected_value', () => {
    const apiStateHub = new APIStateHub(builder, stateIDMap);
    dummyCTX.apiStates = apiStateHub;
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state',
          adapter: (v) => v * 2,
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));

    act(() => {
      apiStateHub.getState('some_api_state').next({
        data: 2,
        error: undefined,
        loading: false,
      });
    });

    expect(result.current.foo).toEqual(4);

    unmount();
  });
});

// 如果要使用 loading，应该是直接 state.loading 就可以了，
// 如果要使用 error，应该是直接 state.error 就可以了，
// 如果根据 loading 状态的不同返回不同的 组件 props value，那这个逻辑应该写在组件内部
// test('resolve_fallback_when_api_error', () => {

// })

// describe('useAPIResultProps_resolve_expected_data_when_api_state_has_error', () => {
//   test('return_fallback_when_previous_data_is_undefined', () => {

//   });

//   test('return_the_latest_non_undefined_data', () => {

//   });
// });
