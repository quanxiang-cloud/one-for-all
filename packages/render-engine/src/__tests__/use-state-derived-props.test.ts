
import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks/pure';

import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';
import useAPIStateDerivedProps from '../use-api-state-derived-props';
import APIStateHub from '../api-state-hub';
import { LocalStateHub } from '../use-local-state';
import { APIDerivedProperty, ComponentPropType, CTX, Instantiated } from '../types';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap = {
  stream_findPetsByTags: { operationID: 'findPetsByTags' },
  stream_findPetsByTags_1: { operationID: 'findPetsByTags' },
};
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);
const ctx: CTX = {
  apiStateContext: apiStateHub,
  localStateContext: new LocalStateHub({}),
};

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated>> = {
    foo: {
      type: ComponentPropType.APIDerivedProperty,
      fallback: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      adapter: convertorFn,
    },
    bar: {
      type: ComponentPropType.APIDerivedProperty,
      fallback: { bar: 456 },
      stateID: 'stream_findPetsByTags_1',
      adapter: convertorFn,
    },
  };

  const { result, unmount } = renderHook(() => useAPIStateDerivedProps({ ctx, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(result.all.length).toBe(1);
  expect(convertorFn).not.toBeCalled();
  unmount();
});
