import mockXHR, { delay } from 'xhr-mock';
import { Adapter } from '@ofa/api-spec-adapter';

import APIStateHub from '../api-state-hub';
import { initialState } from '../http/response';
import SharedStatesHub from '../shared-states-hub';
import { CTX } from '../../types';
import NodeStateHub from '../node-state-hub';
import { APIStateSpec } from '../..';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const builder: Adapter = {
  build: () => ({ url: '', method: '' }),
};

const apiStateSpec: APIStateSpec = {
  stream_findPetsByTags: { path: '', method: '' },
};

test('resolve_initial_value_when_no_next_called', (done) => {
  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [state$] = apiStateHub.getStream('stream_findPetsByTags');
  state$.subscribe((result) => {
    expect(result).toMatchObject(initialState);
    done();
  });
});

test('call_next_times', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, delay((req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  }, 100));

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [state$, { run }] = apiStateHub.getStream('stream_findPetsByTags');

  const mockFn = jest.fn();
  state$.subscribe(mockFn);

  await new Promise((r) => setTimeout(() => {
    r(true);
    run({ params: undefined });
  }, 500));

  await new Promise((r) => setTimeout(() => {
    r(true);
    run({ params: undefined });
  }, 500));

  await new Promise((r) => setTimeout(r, 500));

  expect(mockFn).toBeCalledTimes(5);
});

test('only_resolve_the_last_value', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, delay((req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  }, 100));

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [state$, { run }] = apiStateHub.getStream('stream_findPetsByTags');

  const mockFn = jest.fn();
  state$.subscribe(mockFn);

  run();
  run();
  run();
  run();

  await new Promise((r) => setTimeout(r, 500));

  expect(mockFn).toBeCalledTimes(3);
});

test('should_resolve_value', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: new SharedStatesHub({}),
    nodeStates: new NodeStateHub(),
  };
  // todo this must be call before using apiStateHub, this is not a good design
  apiStateHub.initContext(ctx);

  const [state$, { run }] = apiStateHub.getStream('stream_findPetsByTags');

  const fn = jest.fn();
  state$.subscribe(fn);

  run({
    onSuccess: ({ data, error, loading, params }) => {
      // expect(ctx.apiStates).toEqual(apiStateHub);
      expect(fn).toBeCalledWith({
        data: data,
        error: error,
        loading: loading,
        params: params,
      });
      expect(error).toBeUndefined();
      expect(data).toMatchObject(mockRes);
      done();
    },
  });
});

test('same_stateID_same_stream', () => {
  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [state$1, sendRequest1] = apiStateHub.getStream('stream_findPetsByTags');
  const [state$2, sendRequest2] = apiStateHub.getStream('stream_findPetsByTags');

  expect(state$1).toEqual(state$2);
  expect(sendRequest1).toEqual(sendRequest2);
});

test('param_match_input', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200);
  });

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [state$, { run }] = apiStateHub.getStream('stream_findPetsByTags');
  const requestParams = { foo: 'bar' };
  const requestBody = { baz: 'bzz' };

  const fn = jest.fn();

  state$.subscribe(({ params }) => {
    fn(params?.params);
  });

  run({
    params: { params: requestParams, body: requestBody },
    onSuccess: () => {
      expect(fn).toBeCalledWith(requestParams);
      done();
    },
  });
});

test('on_success_should_be_called', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200);
  });

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [, { run }] = apiStateHub.getStream('stream_findPetsByTags');
  const requestParams = { foo: 'bar' };
  const requestBody = { baz: 'bzz' };

  const onSuccessFn = jest.fn();

  run({
    params: { params: requestParams, body: requestBody },
    onSuccess: onSuccessFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onSuccess: onSuccessFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onSuccess: onSuccessFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onSuccess: (state) => {
      onSuccessFn(state);
      expect(onSuccessFn).toBeCalledTimes(1);
      expect(onSuccessFn).toBeCalledWith(state);
      done();
    },
  });
});

test('on_error_should_be_called', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(400);
  });

  const apiStateHub = new APIStateHub(builder, apiStateSpec);
  const [, { run }] = apiStateHub.getStream('stream_findPetsByTags');
  const requestParams = { foo: 'bar' };
  const requestBody = { baz: 'bzz' };

  const onErrorFn = jest.fn();

  run({
    params: { params: requestParams, body: requestBody },
    onError: onErrorFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onError: onErrorFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onError: onErrorFn,
  });
  run({
    params: { params: requestParams, body: requestBody },
    onError: (state) => {
      onErrorFn(state);
      expect(onErrorFn).toBeCalledTimes(1);
      expect(onErrorFn).toBeCalledWith(state);
      done();
    },
  });
});
