import mockXHR, { delay } from 'xhr-mock';

import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';

import APIStateHub from '../api-state-hub';
import { initialState } from '../response';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

test('resolve_initial_value_when_no_next_called', (done) => {
  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$] = stateHub.getStream('stream_findPetsByTags');
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

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$, { run }] = stateHub.getStream('stream_findPetsByTags');

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

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$, { run }] = stateHub.getStream('stream_findPetsByTags');

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

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$, { run }] = stateHub.getStream('stream_findPetsByTags');

  const fn = jest.fn();
  state$.subscribe(fn);

  run({
    onSuccess: (state) => {
      expect(state.ctx.apiStateHub).toEqual(stateHub);
      expect(fn).toBeCalledWith({
        data: state.data,
        error: state.error,
        loading: state.loading,
        params: state.params,
      });
      expect(state.error).toBeUndefined();
      expect(state.data).toMatchObject(mockRes);
      done();
    },
  });
});

test('same_stateID_same_stream', () => {
  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$1, sendRequest1] = stateHub.getStream('stream_findPetsByTags');
  const [state$2, sendRequest2] = stateHub.getStream('stream_findPetsByTags');

  expect(state$1).toEqual(state$2);
  expect(sendRequest1).toEqual(sendRequest2);
});

test('param_match_input', (done) => {
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200);
  });

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [state$, { run }] = stateHub.getStream('stream_findPetsByTags');
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

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [, { run }] = stateHub.getStream('stream_findPetsByTags');
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

  const stateHub = new APIStateHub(petStoreSpec, { stream_findPetsByTags: { operationID: 'findPetsByTags' } });
  const [, { run }] = stateHub.getStream('stream_findPetsByTags');
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
