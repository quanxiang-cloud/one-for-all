import mockXHR, { delay } from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import APIStream from '../src/api-stream';
import { APIState } from '../src/types';
import { initialState } from '../src/state/state';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

function logResult(result: APIState): void {
  console.log('result:', result);
}

test('resolve initial value when no next called', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$] = apiStream.getStream('stream_findPetsByTags');

  apiStream$.subscribe((result) => {
    expect(result).toMatchObject(initialState);
    done();
  });
});

test('call_next_times', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, delay((req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  }, 100));

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');

  const mockFn = jest.fn(logResult);
  apiStream$.subscribe(mockFn);

  await new Promise((r) => setTimeout(() => {
    r(true);
    next();
  }, 500));

  await new Promise((r) => setTimeout(() => {
    r(true);
    next();
  }, 500));

  await new Promise((r) => setTimeout(r, 500));

  expect(mockFn).toBeCalledTimes(5);
});

test('only resolve the last value', async () => {
  // const mockRes = { data: { id: 'abc-123' } };
  // mockXHR.get(/.*/, delay((req, res) => {
  //   return res.status(200).body(JSON.stringify(mockRes));
  // }, 100));

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');

  const mockFn = jest.fn((value) => console.log('value', value));
  apiStream$.subscribe(mockFn);

  next();
  next();
  next();
  next();

  await new Promise((r) => setTimeout(r, 500));

  expect(mockFn).toBeCalledTimes(4);
});

test('should resolve value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');

  apiStream$.subscribe(({ error, data: body }) => {
    expect(error).toBeUndefined();
    expect(body).toMatchObject(mockRes);
    done();
  });

  next();
});

test('same streamID, same stream', () => {
  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$1, sendRequest1] = apiStream.getStream('stream_findPetsByTags');
  const [apiStream$2, sendRequest2] = apiStream.getStream('stream_findPetsByTags');

  expect(apiStream$1).toEqual(apiStream$2);
  expect(sendRequest1).toEqual(sendRequest2);
});

test('param match input', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200);
  });

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');
  const requestParams = { foo: 'bar' };
  const requestBody = { baz: 'bzz' };

  apiStream$.subscribe(({ params }) => {
    expect(params?.params).toMatchObject(requestParams);
    expect(params?.body).toMatchObject(requestBody);
    done();
  });

  next({ params: requestParams, body: requestBody });
});
