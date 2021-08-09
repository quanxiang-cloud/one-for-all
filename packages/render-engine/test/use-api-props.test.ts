import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';
import useAPIProps from '../src/use-api-props';
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
  const props: Array<{ propsName: string } & APIProp> = [
    {
      propsName: 'foo',
      type: 'api',
      defaultValue: { foo: 123 },
      streamID: 'stream_findPetsByTags',
      responseConvert: () => {
        return { foo: 'bar' };
      },
    },
    {
      propsName: 'bar',
      type: 'api',
      defaultValue: { bar: 456 },
      streamID: 'stream_findPetsByTags',
      responseConvert: () => {
        return { foo: 'bar' };
      },
    },
  ];

  const { result } = renderHook(() => useAPIProps({ queryResult, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
});

test('resolve expect expect converted value', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const streamIDMap = { stream_findPetsByTags: 'findPetsByTags' };
  const queryResult = new QueryResult(petStoreSpec, streamIDMap);
  const props: Array<{ propsName: string } & APIProp> = [
    {
      propsName: 'foo',
      type: 'api',
      defaultValue: { foo: 123 },
      streamID: 'stream_findPetsByTags',
      responseConvert: () => {
        return { foo: 'bar' };
      },
    },
    {
      propsName: 'bar',
      type: 'api',
      defaultValue: { bar: 456 },
      streamID: 'stream_findPetsByTags',
      responseConvert: () => {
        return { foo: 'bar' };
      },
    },
  ];

  const { result } = renderHook(() => useAPIProps({ queryResult, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
});
