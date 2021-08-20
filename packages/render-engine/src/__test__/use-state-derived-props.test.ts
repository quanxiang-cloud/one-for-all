import type { APIDerivedProperty } from '../types';

import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '@ofa/spec-interpreter/src/__test__/petstore-spec';
import useStateDerivedProps from '../use-api-state-derived-props';
import StateHub from '../state-hub';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap = { stream_findPetsByTags: 'findPetsByTags' };
const stateHub = new StateHub(petStoreSpec, stateIDMap);

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const props: Record<string, APIDerivedProperty> = {
    foo: {
      type: 'api_derived_property',
      initialValue: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      convertor: convertorFn,
    },
    bar: {
      type: 'api_derived_property',
      initialValue: { bar: 456 },
      stateID: 'stream_findPetsByTags',
      convertor: convertorFn,
    },
  };

  const { result } = renderHook(() => useStateDerivedProps({ stateHub, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(convertorFn).not.toBeCalled();
});
