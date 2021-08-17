import mockXHR, { delay } from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import APIStream from '../src/api-stream';
import { initialState } from '../src/response';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('resolve_initial_value_when_no_next_called', (done) => {
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

  const mockFn = jest.fn();
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

test('only_resolve_the_last_value', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, delay((req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  }, 100));

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');

  const mockFn = jest.fn();
  apiStream$.subscribe(mockFn);

  next();
  next();
  next();
  next();

  await new Promise((r) => setTimeout(r, 500));

  expect(mockFn).toBeCalledTimes(3);
});

test('should_resolve_value', (done) => {
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

test('same_streamID_same_stream', () => {
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
