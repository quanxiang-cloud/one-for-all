import mockXHR, { sequence } from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getResponse$ from '../src/api-response';
import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('value_would_not_resolve_without_call_next', () => {
  const beforeStartFn = jest.fn();
  const afterSolvedFn = jest.fn();
  const subscriber = jest.fn();
  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
    beforeStart: beforeStartFn,
    afterSolved: afterSolvedFn,
  });

  response$.subscribe(subscriber);

  expect(beforeStartFn).not.toBeCalled();
  expect(afterSolvedFn).not.toBeCalled();
  expect(subscriber).not.toBeCalled();
});

test('value_should_resolve_after_call_next', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const beforeStartFn = jest.fn();
  const afterSolvedFn = jest.fn();
  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
    beforeStart: beforeStartFn,
    afterSolved: afterSolvedFn,
  });

  nextParams({ params: { foo: 'bar' } });

  response$.subscribe(({ data, params }) => {
    expect(beforeStartFn).toBeCalled();
    expect(afterSolvedFn).toBeCalled();
    expect(data).toMatchObject(mockRes);
    expect(params).toMatchObject({ params: { foo: 'bar' } });
    done();
  });
});

test('resolve_same_value_no_matter_how_many_subscribers', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
  });

  nextParams();

  function assertFn(resolve: (value: unknown) => void): void {
    response$.subscribe(({ data }) => {
      expect(data).toMatchObject(mockRes);
      resolve(data);
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
      expect(response.params).toMatchObject({ params: { foo: 'bar' } });
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

  response$.subscribe(({ data }) => {
    expect(afterSolvedFn).toBeCalledTimes(1);
    expect(data).toMatchObject(mockRes);
    done();
  });
});

test('error_should_not_be_undefined', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(400).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
  });

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

  response$.subscribe(({ error }) => {
    expect(error).toBeTruthy();
    done();
  });
});

test('stream_return_normal_after_retry_1', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, sequence([
    (req, res) => {
      return res.status(400).body(JSON.stringify(mockRes));
    },
    (req, res) => {
      return res.status(200).body(JSON.stringify(mockRes));
    },
  ]));

  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
  });

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);
  nextParams(requestParams);

  response$.subscribe(({ error, data }) => {
    expect(data).toBeTruthy();
    expect(error).toBeUndefined();
  });
});

test('stream_return_normal_after_retry_2', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, sequence([
    (req, res) => {
      return res.status(400).body(JSON.stringify(mockRes));
    },
    (req, res) => {
      return res.status(200).body(JSON.stringify(mockRes));
    },
  ]));

  const requestBuilder = new RequestBuilder(petStoreSpec);

  const [response$, nextParams] = getResponse$({
    requestBuilder,
    operationID: 'findPetsByTags',
  });

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);
  expect.assertions(4);

  return new Promise((resolve) => {
    const sub = response$.subscribe(({ error, data }) => {
      expect(data).toBeUndefined();
      expect(error).toBeTruthy();
      resolve(true);
      sub.unsubscribe();
    });
  }).then(() => {
    nextParams(requestParams);
  }).then(() => {
    return response$.subscribe(({ error, data }) => {
      expect(data).toBeTruthy();
      // todo jest bug?
      expect(error).toEqual(3);
    });
  });
});
