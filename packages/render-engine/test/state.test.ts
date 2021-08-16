import mockXHR from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getResponseService$, { initialState } from '../src/state/state';
import RequestBuilder from '@ofa/request-builder';
import { APIState } from '../src/types';
import { map, Subject } from 'rxjs';
import { RequestParams } from '@ofa/request-builder/src/types';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const requestBuilder = new RequestBuilder(petStoreSpec);

test('initial_value', (done) => {
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseService$(request$);

  apiState$.subscribe((result) => {
    expect(result).toMatchObject(initialState);
    done();
  });
});

test('multiple_subscriber_get_same_value', (done) => {
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseService$(request$);

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

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseService$(request$);

  let times = 0;
  const resultList: Array<Omit<APIState, 'params'>> = [];
  apiState$.subscribe((result) => {
    resultList.push(result);
    times = times + 1;
    if (times === 3) {
      expect(resultList).toHaveLength(3);
      expect(resultList).toMatchObject([
        {
          data: undefined,
          error: undefined,
          loading: false,
        },
        {
          loading: true,
          data: undefined,
          error: undefined,
        },
        {
          loading: false,
          data: mockRes,
          error: undefined,
        },
      ]);
      done();
    }
  });

  params$.next({ params: { foo: 'bar' } });
});

// test('state_refresh', (done) => {
//   const mockRes = { data: { id: 'abc-123' } };
//   mockXHR.get(/.*/, (req, res) => {
//     return res.status(200).body(JSON.stringify(mockRes));
//   });

//   let refreshCalled = false;

//   const params$ = new Subject<RequestParams>();
//   const request$ = params$.pipe(
//     map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
//   );
//   const apiState$ = getResponseService$(request$);

//   apiState$.pipe(
//     skip(1),
//     filter(({ loading }) => !loading),
//     tap(() => {
//       if (!refreshCalled) {
//         refreshCalled = true;
//         streamActions.refresh();
//       }
//     }),
//     pairwise(),
//   ).subscribe(([r1, r2]) => {
//     expect(r1.data).toMatchObject(r2.data);
//     done();
//   });

//   streamActions.next(undefined);
// });
