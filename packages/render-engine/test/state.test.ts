import mockXHR from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getResponseService$, { initialState } from '../src/state/state';
import RequestBuilder from '@ofa/request-builder';
import { APIState } from '../src/types';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const requestBuilder = new RequestBuilder(petStoreSpec);

test('initial_value', (done) => {
  const [apiState$] = getResponseService$('findPetsByTags', requestBuilder);

  apiState$.subscribe((result) => {
    expect(result).toMatchObject(initialState);
    done();
  });
});

test('multiple_subscriber_get_same_value', (done) => {
  const [apiState$] = getResponseService$('findPetsByTags', requestBuilder);

  const fn = jest.fn();

  apiState$.subscribe(fn);
  apiState$.subscribe(fn);
  apiState$.subscribe(fn);
  apiState$.subscribe(() => done());

  expect(fn).toBeCalledTimes(3);
  expect(fn).toBeCalledWith(initialState);
});

test('response_state_table', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const [apiState$, streamActions] = getResponseService$('findPetsByTags', requestBuilder);

  let times = 0;
  const resultList: Array<APIState> = [];
  apiState$.subscribe((result) => {
    resultList.push(result);
    times = times + 1;
    if (times === 3) {
      expect(resultList).toHaveLength(3);
      expect(resultList).toMatchObject([
        {
          data: undefined,
          error: undefined,
          params: undefined,
          loading: false,
        },
        {
          loading: true,
          data: undefined,
          error: undefined,
          params: undefined,
        },
        {
          loading: false,
          data: mockRes,
          error: undefined,
          params: { params: { foo: 'bar' } },
        },
      ]);
      done();
    }
  });

  streamActions.next({ params: { foo: 'bar' } });
});
