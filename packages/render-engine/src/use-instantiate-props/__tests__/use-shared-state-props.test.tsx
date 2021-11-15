import { renderHook, act } from '@testing-library/react-hooks/pure';
import APIStateHub from '../../ctx/api-state-hub';
import { APIStateSpec, ComponentPropType, CTX, Instantiated, SharedStateProperty } from '../../types';

import useSharedStateProps from '../use-shared-state-props';
import SharedStatesHub from '../../ctx/shared-states-hub';

const stateIDMap: APIStateSpec = { stream_findPetsByTags: { operationID: 'findPetsByTags' } };
import petStoreSpec from '../../ctx/spec-interpreter/__tests__/fixtures/petstore-spec';
import NodeInternalStates from '../../ctx/node-internal-states';
import { SchemaNode } from '../..';
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);

test('shared_state_should_resolve_expected_initial_value', () => {
  const props: Record<string, SharedStateProperty<Instantiated>> = {
    foo: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_undefined',
      fallback: undefined,
    },
    bar: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_foo',
      fallback: undefined,
    },
    baz: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_object',
      fallback: undefined,
    },
    twins_one: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'twins',
      fallback: undefined,
    },
    twins_two: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'twins',
      fallback: undefined,
    },
  };

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    props: props,
    type: 'html-element',
    name: 'div',
  };

  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: new SharedStatesHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
      value_should_be_object: { initial: { bar: 'bzz' } },
    }),
    nodeInternalStates: new NodeInternalStates(),
  };

  const { result, unmount } = renderHook(() => useSharedStateProps(node, ctx));

  expect(result.current.foo).toBeUndefined();
  expect(result.current.bar).toEqual('foo');
  expect(result.current.baz).toEqual({ bar: 'bzz' });
  expect(result.current.twins_one).toEqual(result.current.twins_two);
  unmount();
});

test('shared_state_should_resolve_expected_update_changed', () => {
  const props: Record<string, SharedStateProperty<Instantiated>> = {
    foo: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_undefined',
      fallback: undefined,
    },
    bar: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_foo',
      fallback: undefined,
    },
    baz: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'value_should_be_object',
      fallback: undefined,
    },
    twins_one: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'twins',
      fallback: undefined,
    },
    twins_two: {
      type: ComponentPropType.SharedStateProperty,
      stateID: 'twins',
      fallback: undefined,
    },
  };

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    props: props,
    type: 'html-element',
    name: 'div',
  };

  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: new SharedStatesHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
      value_should_be_object: { initial: { bar: 'bzz' } },
    }),
    nodeInternalStates: new NodeInternalStates(),
  };

  const { result, unmount } = renderHook(() => useSharedStateProps(node, ctx));
  expect(result.current.foo).toBeUndefined();

  act(() => {
    ctx.sharedStates.getState$('value_should_be_undefined').next(true);
  });

  expect(result.current.foo).toEqual(true);
  expect(result.current.bar).toEqual('foo');
  expect(result.current.baz).toEqual({ bar: 'bzz' });
  expect(result.current.twins_one).toEqual(result.current.twins_two);

  unmount();
});
