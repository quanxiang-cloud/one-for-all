import { renderHook, act } from '@testing-library/react-hooks';
import APIStateHub from '../api-state-hub';
import { APIStateSpec, CTX, Instantiated, LocalStateProperty, SetLocalStateProperty } from '../types';

import { useLocalStateProps, useSetLocalStateProps, LocalStateHub } from '../use-local-state';

const stateID = 'some_local_state';

const stateIDMap: APIStateSpec = { stream_findPetsByTags: { operationID: 'findPetsByTags' } };
import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);

test('LocalStateHub_use_local_state_resolve_initial_value', () => {
  const props: Record<string, LocalStateProperty<Instantiated>> = {
    foo: {
      type: 'local_state_property',
      stateID: 'value_should_be_undefined',
    },
    bar: {
      type: 'local_state_property',
      stateID: 'value_should_be_foo',
    }
  };

  const ctx: CTX = {
    apiStateContext: apiStateHub,
    localStateContext: new LocalStateHub({
      value_should_be_undefined: { initial: undefined },
      value_should_be_foo: { initial: 'foo' },
    }),
  };

  const { result } = renderHook(() => useLocalStateProps({ props, ctx }));

  expect(result.current.foo).toBeUndefined();
  expect(result.current.bar).toEqual('foo');
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
    }
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

  const { result } = renderHook(() => useLocalStateProps({ props, ctx }));

  expect(result.current.foo).toEqual('updated');
  expect(result.current.bar).toEqual('foo');
})
