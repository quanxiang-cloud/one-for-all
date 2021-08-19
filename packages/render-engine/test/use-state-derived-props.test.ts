import type { ResultDerivedProperty } from '../src/types';

import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '@ofa/spec-interpreter/test/petstore-spec';
import useStateDerivedProps from '../src/use-api-state-derived-props';
import StateHub from '../src/state-hub';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap = { stream_findPetsByTags: 'findPetsByTags' };
const stateHub = new StateHub(petStoreSpec, stateIDMap);

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const props: Record<string, ResultDerivedProperty> = {
    foo: {
      type: 'result_derived_property',
      initialValue: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      convertor: convertorFn,
    },
    bar: {
      type: 'result_derived_property',
      initialValue: { bar: 456 },
      stateID: 'stream_findPetsByTags',
      convertor: convertorFn,
    },
  };

  const { result } = renderHook(() => useStateDerivedProps({ stateHub, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(convertorFn).not.toBeCalled();
});
