import type { ResultDerivedProperty } from '../src/types';

import mockXHR from 'xhr-mock';
import { renderHook, act } from '@testing-library/react-hooks';

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

test('expect_resolve_converted_value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const fixedConvertedValue = { abc: '123' };

  const props: Record<string, ResultDerivedProperty> = {
    foo: {
      type: 'result_derived_property',
      initialValue: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      convertor: () => fixedConvertedValue,
    },
    bar: {
      type: 'result_derived_property',
      initialValue: { bar: 456 },
      stateID: 'stream_findPetsByTags',
      convertor: () => fixedConvertedValue,
    },
  };

  const { result } = renderHook(() => useStateDerivedProps({ stateHub, props }));
  expect(result.current?.data).toMatchObject({ foo: fixedConvertedValue, bar: fixedConvertedValue });

  act(() => {
    const run = stateHub.getAction('stream_findPetsByTags');
    run({ onSuccess: done });
  });
});
