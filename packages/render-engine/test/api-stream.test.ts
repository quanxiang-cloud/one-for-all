import mockXHR from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import APIStream from '../src/api-stream';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('should resolve value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$, { next }] = apiStream.getStream('stream_findPetsByTags');

  apiStream$.subscribe(({ error, body }) => {
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
