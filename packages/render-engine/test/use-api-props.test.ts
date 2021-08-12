import type { APICallProperty, APIDerivedProperty } from '../src/types';

import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';
import useAPIDerivedProps from '../src/use-api-derived-props';
import useAPICallProps from '../src/use-api-call-props';
import QueryResult from '../src/query-result';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('resolve expect initial value', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const streamIDMap = { stream_findPetsByTags: 'findPetsByTags' };
  const queryResult = new QueryResult(petStoreSpec, streamIDMap);
  const props: Record<string, APIDerivedProperty> = {
    foo: {
      type: 'api_derived_property',
      initialValue: { foo: 123 },
      streamID: 'stream_findPetsByTags',
      convertor: () => {
        return { foo: 'bar' };
      },
    },
    bar: {
      type: 'api_derived_property',
      initialValue: { bar: 456 },
      streamID: 'stream_findPetsByTags',
      convertor: () => {
        return { foo: 'bar' };
      },
    },
  };

  const { result } = renderHook(() => useAPIDerivedProps({ queryResult, props }));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
});

test('resolve expect expect converted value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const streamIDMap = { stream_findPetsByTags: 'findPetsByTags' };
  const queryResult = new QueryResult(petStoreSpec, streamIDMap);

  const apiCallProps: Record<string, APICallProperty> = {
    update: {
      type: 'api_call_property',
      streamID: 'stream_findPetsByTags',
      convertor: () => {
        return { params: { foo: 'bar' } };
      },
    },
  };
  const apiCallPropsResult = useAPICallProps({ queryResult, props: apiCallProps });
  queryResult.getValue('stream_findPetsByTags', (result) => result).subscribe((result) => {
    expect(result.body).toMatchObject(mockRes);
    done();
  });

  apiCallPropsResult.update();
});
