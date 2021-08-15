import mockXHR from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getResponse$ from '../src/api-response';
import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('initial_response_should_be_undefined', (done) => {
  const beforeStartFn = jest.fn();
  const afterSolvedFn = jest.fn();
  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
    beforeStart: beforeStartFn,
    afterSolved: afterSolvedFn,
  });

  response$.subscribe((result) => {
    expect(result).toMatchObject({ data: undefined, error: undefined, params: undefined });
    expect(beforeStartFn).not.toBeCalled();
    expect(afterSolvedFn).not.toBeCalled();
    done();
  });
});

test('resolve_same_value_no_matter_how_many_subscribers', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
  });

  function assertFn(resolve: (value: unknown) => void): void {
    response$.subscribe((response) => {
      expect(response).toMatchObject({ data: undefined, error: undefined, params: undefined });
      resolve(response);
    });
  }

  return Promise.all([
    new Promise(assertFn),
    new Promise(assertFn),
    new Promise(assertFn),
    new Promise(assertFn),
  ]);
});

test('resolve_expected_data', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const beforeStartFn = jest.fn();

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
    beforeStart: beforeStartFn,
  });

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

  expect(beforeStartFn).toBeCalled();

  function assertFn(resolve: (value: unknown) => void): void {
    response$.subscribe((response) => {
      expect(response.params).toMatchObject(requestParams as any);
      expect(response.data).toMatchObject(mockRes);
      resolve(response);
    });
  }

  return Promise.all([
    new Promise(assertFn),
    new Promise(assertFn),
    new Promise(assertFn),
    new Promise(assertFn),
  ]);
});

test('before_and_after_callback', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const beforeStartFn = jest.fn();
  const afterSolvedFn = jest.fn();

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
    beforeStart: beforeStartFn,
    afterSolved: afterSolvedFn,
  });

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);
  nextParams(requestParams);
  nextParams(requestParams);
  nextParams(requestParams);

  expect(beforeStartFn).toBeCalledTimes(4);

  response$.subscribe(() => {
    expect(afterSolvedFn).toBeCalledTimes(1);
    done();
  });
});
