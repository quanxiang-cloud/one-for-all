import mockXHR from 'xhr-mock';

import RequestBuilder from '@ofa/request-builder';
import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getQueryResultStream from '../src/api-stream';

const builder = new RequestBuilder(petStoreSpec as any);

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('api stream resolve value', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body('{"data":{"id":"abc-123"}}');
  });

  const [apiStream$, setParams] = getQueryResultStream('findPetsByStatus', builder);
  apiStream$.subscribe(({ error, body }) => {
    expect(error).toBeUndefined();
    expect(body).toMatchObject({ "data": { "id": "abc-123" } });
    done();
  });
});

test('resolve value twice', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body('{"data":{"id":"abc-123"}}');
  });

  const [apiStream$, setParams] = getQueryResultStream('findPetsByStatus', builder);
  const mockFn = jest.fn(() => console.log('mock function called!'));
  apiStream$.subscribe({
    next: mockFn,
    complete: () => {
      expect(mockFn).toBeCalledTimes(2);
      done();
    }
  });

  setParams({ foo: 'bar' });
  // setParams._complete();
});

// test('api should throw', (done) => {
//   mockXHR.get(/.*/, (req, res) => {
//     return res.status(200).body('');
//   });

//   const [apiStream$] = getQueryResultStream('some_nonexistent_api', builder);
//   apiStream$.subscribe(({ error, body }) => {
//     expect(error).toBeTruthy();
//     expect(body).toBeUndefined();
//     done();
//   });
// })
