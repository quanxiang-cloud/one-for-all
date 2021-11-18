import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks/pure';
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

describe('useAPIResultProps_resolve_expected_fallback', () => {
  const stateIDMap = {
    some_api_state_has_not_be_fired: { apiID: 'findPetsByTags' },
  };
  const apiStateHub = new APIStateHub(builder, stateIDMap);
  dummyCTX.apiStates = apiStateHub;

  test('resolve_fallback_when_api_state_data_is_undefined', () => {
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state_has_not_be_fired',
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    expect(result.current.foo).toMatchObject(fallback);
    unmount();
  });

  test('resolve_fallback_when_adapter_throw', () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIResultProperty,
          fallback: fallback,
          stateID: 'some_api_state_has_not_be_fired',
          adapter: () => {
            throw new Error('should_be_handled');
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
    expect(result.current.foo).toMatchObject(fallback);
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();

    unmount();
  });

  // 如果要使用 loading，应该是直接 state.loading 就可以了，
  // 如果要使用 error，应该是直接 state.error 就可以了，
  // 如果根据 loading 状态的不同返回不同的 组件 props value，那这个逻辑应该写在组件内部
  // test('resolve_fallback_when_api_error', () => {

  // })
});

// describe('useAPIResultProps_resolve_expected_data_when_api_state_has_error', () => {
//   test('return_fallback_when_previous_data_is_undefined', () => {

//   });

//   test('return_the_latest_non_undefined_data', () => {

//   });
// });

test('expect_resolve_initial_value', () => {
  const stateIDMap = {
    some_api_state_has_not_be_fired: { apiID: 'findPetsByTags' },
  };
  const apiStateHub = new APIStateHub(builder, stateIDMap);
  dummyCTX.apiStates = apiStateHub;

  const convertorFn = jest.fn();

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      foo: {
        type: NodePropType.APIResultProperty,
        fallback: { foo: 123 },
        stateID: 'some_api_state_has_not_be_fired',
        adapter: convertorFn,
      },
      bar: {
        type: NodePropType.APIResultProperty,
        fallback: { bar: 456 },
        stateID: 'some_api_state_has_not_be_fired',
        adapter: convertorFn,
      },
    },
  };

  const { result, unmount } = renderHook(() => useAPIResultProps(node, dummyCTX));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(result.all.length).toBe(1);
  expect(convertorFn).not.toBeCalled();

  unmount();
});
