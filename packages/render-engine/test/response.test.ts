import mockXHR, { sequence } from 'xhr-mock';

import petStoreSpec from '@ofa/request-builder/test/petstore-spec';

import getResponse$ from '../src/state/response';
import RequestBuilder from '@ofa/request-builder';
import { RequestParams } from '@ofa/request-builder/src/types';
import { map, ReplaySubject, Subject } from 'rxjs';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('value_would_not_resolve_without_call_next', () => {
  const subscriber = jest.fn();
  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );

  const response$ = getResponse$(request$);

  response$.subscribe(subscriber);

  expect(subscriber).not.toBeCalled();
});

test('value_should_resolve_after_call_next', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

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
  const params$ = new ReplaySubject<RequestParams>(1);
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

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
      expect(error).toBeUndefined();
      // expect.assertions(4);
    });
  });
});

test('later_subscriber_should_have_expected_value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const requestBuilder = new RequestBuilder(petStoreSpec);
  const params$ = new Subject<RequestParams>();
  const request$ = params$.pipe(
    map((params) => requestBuilder.buildRequest('findPetsByTags', params)),
  );
  function nextParams(params: RequestParams): void {
    params$.next(params);
  }

  const response$ = getResponse$(request$);

  const requestParams: RequestParams = { params: { foo: 'bar' } };
  nextParams(requestParams);

  response$.subscribe(({ data }) => {
    expect(data).toMatchObject(mockRes);
  });

  response$.subscribe(({ data }) => {
    expect(data).toMatchObject(mockRes);
    done();
  });
});
