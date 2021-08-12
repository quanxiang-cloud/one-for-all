import type { APIDerivedProperty } from '../src/types';

import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';
import useAPIDerivedProps from '../src/use-api-derived-props';
import QueryResult from '../src/use-query';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('resolve expect initial value', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const streamIDMap = { stream_findPetsByTags: 'findPetsByTags' };
  const queryResult = new QueryResult(petStoreSpec, streamIDMap);
  const props: Array<{ propsName: string } & APIDerivedProperty> = [
    {
      propsName: 'foo',
      type: 'api_derived_property',
      initialValue: { foo: 123 },
      streamID: 'stream_findPetsByTags',
      convertor: () => {
        return { foo: 'bar' };
      },
    },
    {
      propsName: 'bar',
      type: 'api_derived_property',
      initialValue: { bar: 456 },
      streamID: 'stream_findPetsByTags',
      convertor: () => {
        return { foo: 'bar' };
      },
    },
  ];

  const { result } = renderHook(() => useAPIDerivedProps({ queryResult, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
});

test('resolve expect expect converted value', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const streamIDMap = { stream_findPetsByTags: 'findPetsByTags' };
  const queryResult = new QueryResult(petStoreSpec, streamIDMap);
  const props: Array<{ propsName: string } & APIDerivedProperty> = [
    {
      propsName: 'foo',
      type: 'api_derived_property',
      initialValue: { foo: 123 },
      streamID: 'stream_findPetsByTags',
      convertor: ({ body }) => {
        return { foo: body.foo * 2 };
      },
    },
    {
      propsName: 'bar',
      type: 'api_derived_property',
      initialValue: { bar: 456 },
      streamID: 'stream_findPetsByTags',
      convertor: ({ body }) => {
        return { foo: body.bar * 2 };
      },
    },
  ];

  const { result } = renderHook(() => useAPIDerivedProps({ queryResult, props }));
  // todo initial param called then assert
  expect(result.current).toMatchObject({ foo: { foo: 123 * 2 }, bar: { bar: 456 * 2 } });
});
