import mockXHR, { sequence } from 'xhr-mock';

import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';

import SpecInterpreter from '../spec-interpreter';
import type { RequestParams } from '../../types';
import { interval, map, pairwise, Subject, take, tap } from 'rxjs';
import getResponseState$, { http, initialState } from '../response';
import { APIState } from '../../types';

const specInterpreter = new SpecInterpreter(petStoreSpec);

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('value_would_not_resolve_without_call_next', () => {
  const subscriber = jest.fn();
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );

  const response$ = http(request$);

  response$.subscribe(subscriber);

  expect(subscriber).not.toBeCalled();
});

test('value_should_resolve_after_call_next', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = http(request$);

  nextParams({ params: { foo: 'bar' } });

  response$.subscribe(({ data }) => {
    expect(data).toMatchObject(mockRes);
    done();
  });
});

test('resolve_same_value_no_matter_how_many_subscribers', () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = http(request$);

  nextParams(undefined);

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

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = http(request$);

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

  function assertFn(resolve: (value: unknown) => void): void {
    response$.subscribe((response) => {
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

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = http(request$);

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);
  nextParams(requestParams);
  nextParams(requestParams);
  nextParams(requestParams);

  response$.subscribe(({ data }) => {
    expect(data).toMatchObject(mockRes);
    done();
  });
});

test('error_should_not_be_undefined', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(400).body(JSON.stringify(mockRes));
  });

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = http(request$);
  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

  response$.subscribe(({ error }) => {
    expect(error).toBeTruthy();
    done();
  });
});

test('stream_return_normal_after_retry_1', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, sequence([
    (req, res) => {
      return res.status(400).body(JSON.stringify(mockRes));
    },
    (req, res) => {
      return res.status(200).body(JSON.stringify(mockRes));
    },
  ]));

  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  const response$ = http(request$);

  const fn = jest.fn();

  expect.assertions(5);

  response$.pipe(
    pairwise(),
    tap(fn),
  ).subscribe(([res1, res2]) => {
    expect(res1.data).toBeUndefined();
    expect(res1.error).toBeTruthy();
    expect(res2.data).toBeTruthy();
    expect(res2.error).toBeUndefined();
    expect(fn).toBeCalledTimes(1);
  });

  interval(1000).pipe(
    take(2),
    tap(() => params$.next(requestParams)),
  ).subscribe({ complete: () => done() });
});

test('initial_value', (done) => {
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseState$(request$);

  apiState$.subscribe((result) => {
    expect(result).toMatchObject(initialState);
    done();
  });
});

test('multiple_subscriber_get_same_value', (done) => {
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseState$(request$);

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
    map((params) => specInterpreter.buildRequest('findPetsByTags', params)),
  );
  const apiState$ = getResponseState$(request$);

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
