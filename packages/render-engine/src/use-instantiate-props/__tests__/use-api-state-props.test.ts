import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks/pure';

import petStoreSpec from '../../ctx/spec-interpreter/__tests__/fixtures/petstore-spec';
import useAPIStateProps from '../use-api-state-props';
import APIStateHub from '../../ctx/api-state-hub';
import { SchemaNode, NodePropType, Instantiated } from '../../types';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

describe('useAPIStateProps_resolve_expected_fallback', () => {
  const stateIDMap = {
    some_api_state_has_not_be_fired: { operationID: 'findPetsByTags' },
  };
  const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);
  dummyCTX.apiStates = apiStateHub;

  test('resolve_fallback_when_api_state_data_is_undefined', () => {
    const fallback = { foo: 123 };
    const node: SchemaNode<Instantiated> = {
      key: 'some_key',
      type: 'html-element',
      name: 'div',
      props: {
        foo: {
          type: NodePropType.APIDerivedProperty,
          fallback: fallback,
          stateID: 'some_api_state_has_not_be_fired',
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIStateProps(node, dummyCTX));
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
          type: NodePropType.APIDerivedProperty,
          fallback: fallback,
          stateID: 'some_api_state_has_not_be_fired',
          adapter: () => {
            throw new Error('should_be_handled');
          },
        },
      },
    };

    const { result, unmount } = renderHook(() => useAPIStateProps(node, dummyCTX));
    expect(result.current.foo).toMatchObject(fallback);
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();

    unmount();
  });
});

describe('useAPIStateProps_resolve_expected_data_when_api_state_has_error', () => {
  test('return_fallback_when_previous_data_is_undefined', () => {

  });

  test('return_the_latest_non_undefined_data', () => {

  });
});

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    type: 'html-element',
    name: 'div',
    props: {
      foo: {
        type: NodePropType.APIDerivedProperty,
        fallback: { foo: 123 },
        stateID: 'stream_findPetsByTags',
        adapter: convertorFn,
      },
      bar: {
        type: NodePropType.APIDerivedProperty,
        fallback: { bar: 456 },
        stateID: 'stream_findPetsByTags_1',
        adapter: convertorFn,
      },
    },
  };

  const { result, unmount } = renderHook(() => useAPIStateProps(node, dummyCTX));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(result.all.length).toBe(1);
  expect(convertorFn).not.toBeCalled();
  unmount();
});
