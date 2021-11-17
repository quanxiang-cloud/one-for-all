import mockXHR, { MockResponse } from 'xhr-mock';
import { Subject } from 'rxjs';
import { AjaxConfig } from 'rxjs/ajax';

import http from '../http';

test('http_will_not_resolve_value_if_no_request_emitted', () => {
  expect.assertions(0);
  const request$ = new Subject<AjaxConfig>();

  const response$ = http(request$);

  response$.subscribe(() => expect.anything());
});

test('http_should_resolve_value_when_request_emitted', (done) => {
  mockXHR.setup();
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const request$ = new Subject<AjaxConfig>();

  const response$ = http(request$);

  response$.subscribe(({ data, error }) => {
    try {
      expect(data).toEqual(mockRes);
      expect(error).toBeUndefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  request$.next({
    url: '/api/foo',
    method: 'get',
    queryParams: { foo: 'bar' },
  });
  mockXHR.teardown();
});

describe('http_resolve_expected_error', () => {
  test('should_resolve_network_error', (done) => {
    const request$ = new Subject<AjaxConfig>();

    const response$ = http(request$);

    response$.subscribe(({ data, error }) => {
      try {
        expect(error).toBeTruthy();
        expect(data).toBeUndefined();
        done();
      } catch (error) {
        done(error);
      }
    });

    request$.next({
      url: '/api/foo',
      method: 'get',
      queryParams: { foo: 'bar' },
    });
  });

  test('should_resolve_4xx_error', (done) => {
    mockXHR.setup();
    const mockRes = { data: { id: 'abc-123' } };
    mockXHR.get(/.*/, (req, res) => {
      return res.status(404).body(JSON.stringify(mockRes));
    });

    const request$ = new Subject<AjaxConfig>();

    const response$ = http(request$);

    response$.subscribe(({ data, error }) => {
      try {
        expect(error).toBeTruthy();
        expect(error.response).toMatchObject(mockRes);
        expect(data).toBeUndefined();
        done();
      } catch (error) {
        done(error);
      }
    });

    request$.next({
      url: '/api/foo',
      method: 'get',
      queryParams: { foo: 'bar' },
    });

    mockXHR.teardown();
  });
});

// todo optimize this test
test('http_should_cancel_pending_request', (done) => {
  expect.assertions(1);

  mockXHR.setup();
  mockXHR.get(/.*/, () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new MockResponse());
      }, 1000);
    });
  });

  const request$ = new Subject<AjaxConfig>();

  const response$ = http(request$);

  const callback = jest.fn(() => {
    try {
      expect(callback).toBeCalledTimes(1);
      done();
    } catch (error) {
      done(error);
    }
  });

  response$.subscribe(callback);

  request$.next({
    url: '/api/foo',
    method: 'get',
    queryParams: { foo: 'bar' },
  });

  request$.next({
    url: '/api/foo',
    method: 'get',
    queryParams: { foo: 'bar' },
  });

  mockXHR.teardown();
});
