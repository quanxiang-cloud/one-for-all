import type { APIDerivedProperty, Instantiated } from '../types';

import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';
import useStateDerivedProps from '../use-api-state-derived-props';
import StateHub from '../state-hub';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap = { stream_findPetsByTags: { operationID: 'findPetsByTags' } };
const stateHub = new StateHub(petStoreSpec, stateIDMap);

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated>> = {
    foo: {
      type: 'api_derived_property',
      initialValue: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      template: convertorFn,
    },
    bar: {
      type: 'api_derived_property',
      initialValue: { bar: 456 },
      stateID: 'stream_findPetsByTags',
      template: convertorFn,
    },
  };

  const { result } = renderHook(() => useStateDerivedProps({ stateHub, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(convertorFn).not.toBeCalled();
});
