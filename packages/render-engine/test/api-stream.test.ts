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
  const [apiStream$, sendRequest] = apiStream.getStream('stream_findPetsByTags');

  apiStream$.subscribe(({ error, body }) => {
    expect(error).toBeUndefined();
    expect(body).toMatchObject(mockRes);
    done();
  });

  sendRequest();
});

test('same streamID, same stream', () => {
  const apiStream = new APIStream(petStoreSpec, { stream_findPetsByTags: 'findPetsByTags' });
  const [apiStream$1, sendRequest1] = apiStream.getStream('stream_findPetsByTags');
  const [apiStream$2, sendRequest2] = apiStream.getStream('stream_findPetsByTags');

  expect(apiStream$1).toEqual(apiStream$2);
  expect(sendRequest1).toEqual(sendRequest2);
});

test('resolve value twice', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body('{"data":{"id":"abc-123"}}');
  });

  const apiStream = new APIStream(petStoreSpec, {});
  const [apiStream$, setParams] = apiStream.getStream('someStream');

  apiStream$.subscribe({
    next: (value) => {
      try {
        expect(value.body).toMatchObject({ data: { id: 'abc-123' } });
        done();
      } catch (error) {
        done(error);
      }
    },
  });

  setParams({ params: { foo: 'bar' } });
  setParams({ params: { foo: 'bar' } });
  setParams({ params: { foo: 'bar' } });
  setParams({ params: { foo: 'bar' } });
  setParams._complete();
});

test('api should throw', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body('');
  });

  const apiStream = new APIStream(petStoreSpec, {});
  const [apiStream$, sendRequest] = apiStream.getStream('someStream');

  apiStream$.subscribe(({ error, body }) => {
    expect(error).toBeTruthy();
    expect(body).toBeUndefined();
    done();
  });

  sendRequest();
});

test('same streamID same apiStream', () => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body('{"data":{"id":"abc-123"}}');
  });

  const apiStream = new APIStream(petStoreSpec, {});
  const [apiStream$1, setParams1] = apiStream.getStream('someStream');
  const [apiStream$2, setParams2] = apiStream.getStream('someStream');

  expect(apiStream$1).toEqual(apiStream$2);
  expect(setParams1).toEqual(setParams2);
});
