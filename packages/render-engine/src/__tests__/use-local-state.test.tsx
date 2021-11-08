import { renderHook, act } from '@testing-library/react-hooks/pure';
import APIStateHub from '../api-state-hub';
import { APIStateSpec, CTX, Instantiated, LocalStateProperty, SetLocalStateProperty } from '../types';

import { useLocalStateProps, useSetLocalStateProps, LocalStateHub } from '../use-local-state';

const stateIDMap: APIStateSpec = { stream_findPetsByTags: { operationID: 'findPetsByTags' } };
import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);

test('local_state_should_resolve_expected_initial_value', () => {
  const props: Record<string, LocalStateProperty<Instantiated>> = {
    foo: {
      type: 'local_state_property',
      stateID: 'value_should_be_undefined',
    },
    bar: {
      type: 'local_state_property',
      stateID: 'value_should_be_foo',
    },
    baz: {
      type: 'local_state_property',
      stateID: 'value_should_be_object',
    },
    twins_one: {
      type: 'local_state_property',
      stateID: 'twins',
    },
    twins_two: {
      type: 'local_state_property',
      stateID: 'twins',
    },
  };

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: new LocalStateHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
      value_should_be_object: { initial: { bar: 'bzz' } },
    }),
  };

  const { result, unmount } = renderHook(() => useLocalStateProps({ props, ctx }));

  expect(result.current.foo).toBeUndefined();
  expect(result.current.bar).toEqual('foo');
  expect(result.current.baz).toEqual({ bar: 'bzz' });
  expect(result.current.twins_one).toEqual(result.current.twins_two);
  unmount();
});

test('local_state_should_resolve_expected_update_changed', () => {
  const props: Record<string, LocalStateProperty<Instantiated>> = {
    foo: {
      type: 'local_state_property',
      stateID: 'value_should_be_undefined',
    },
    bar: {
      type: 'local_state_property',
      stateID: 'value_should_be_foo',
    },
    baz: {
      type: 'local_state_property',
      stateID: 'value_should_be_object',
    },
    twins_one: {
      type: 'local_state_property',
      stateID: 'twins',
    },
    twins_two: {
      type: 'local_state_property',
      stateID: 'twins',
    },
  };

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: new LocalStateHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
      value_should_be_object: { initial: { bar: 'bzz' } },
    }),
  };

  const { result, unmount } = renderHook(() => useLocalStateProps({ props, ctx }));
  expect(result.current.foo).toBeUndefined();

  act(() => {
    ctx.localStateContext.getState$('value_should_be_undefined').next(true);
  });

  expect(result.current.foo).toEqual(true);
  expect(result.current.bar).toEqual('foo');
  expect(result.current.baz).toEqual({ bar: 'bzz' });
  expect(result.current.twins_one).toEqual(result.current.twins_two);

  unmount();
});

test('useSetLocalStateProps', () => {
  const props: Record<string, LocalStateProperty<Instantiated>> = {
    foo: {
      type: 'local_state_property',
      stateID: 'value_should_be_undefined',
    },
    bar: {
      type: 'local_state_property',
      stateID: 'value_should_be_foo',
    },
  };

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: new LocalStateHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
    }),
  };

  const funcProps: Record<string, SetLocalStateProperty<Instantiated>> = {
    updateFoo: {
      type: 'set_local_state_property',
      stateID: 'value_should_be_undefined',
    },
  };

  act(() => {
    renderHook(() => useSetLocalStateProps({ props: funcProps, ctx })).result.current.updateFoo('updated');
  });

  const { result, unmount } = renderHook(() => useLocalStateProps({ props, ctx }));

  expect(result.current.foo).toEqual('updated');
  expect(result.current.bar).toEqual('foo');
  unmount();
});
