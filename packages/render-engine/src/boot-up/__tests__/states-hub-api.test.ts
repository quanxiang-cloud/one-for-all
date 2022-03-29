import mockXHR from 'xhr-mock';
import type { APISpecAdapter, AjaxConfig } from '@one-for-all/api-spec-adapter';
import { logger } from '@one-for-all/utils';

import StatesHubAPI from '../states-hub-api';
import { initialState } from '../http/response';
import { APIStatesSpec } from '../..';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};

const apiStateSpec: APIStatesSpec = {
  findPetsByTags: { apiID: 'get:/api' },
};

describe('StatesHubAPI_hasState$_return_expected_value', () => {
  test('return_true_if_state_defined_in_self', () => {
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
    const has = statesHubAPI.hasState$('findPetsByTags');

    expect(has).toBe(true);
  });

  test('return_true_if_state_defined_in_parent', () => {
    const parentStateSpec: APIStatesSpec = {
      parentState: { apiID: 'get:/api' },
    };
    const parentHub: StatesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: parentStateSpec });
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec, parentHub });
    const has = statesHubAPI.hasState$('parentState');

    expect(has).toBe(true);
  });

  test('return_false_no_state_defined_in_self_or_parent', () => {
    const parentStateSpec: APIStatesSpec = {
      parentState: { apiID: 'get:/api' },
    };
    const parentHub: StatesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: parentStateSpec });
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec, parentHub });
    const has = statesHubAPI.hasState$('some_state_not_exist');

    expect(has).toBe(false);
  });
});

describe('StatesHubAPI_findState$_return_expected_value', () => {
  test('return_truthy_if_state_defined_in_self', () => {
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
    const state$WithActions = statesHubAPI.findState$('findPetsByTags');

    expect(state$WithActions).toBeTruthy();
  });

  test('return_truthy_if_state_defined_in_parent', () => {
    const parentStateSpec: APIStatesSpec = {
      parentState: { apiID: 'get:/api' },
    };
    const parentHub: StatesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: parentStateSpec });
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec, parentHub });
    const state$WithActions = statesHubAPI.findState$('parentState');

    expect(state$WithActions).toBeTruthy();
  });

  test('return_falsy_no_state_defined_in_self_or_parent', () => {
    const parentStateSpec: APIStatesSpec = {
      parentState: { apiID: 'get:/api' },
    };
    const parentHub: StatesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec: parentStateSpec });
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec, parentHub });
    const state$WithActions = statesHubAPI.findState$('some_state_not_exist');

    expect(state$WithActions).toBeFalsy();
  });
});

describe('APIStates_getState$_refresh_fetch_should_logger_error_if_no_state_id_found', () => {
  test('call_getState$', () => {
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
    statesHubAPI.getState$('some_state_not_exist');

    expect(logger.error).toBeCalled();
  });

  test('call_fetch', () => {
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
    statesHubAPI.fetch('some_state_not_exist', {});

    expect(logger.error).toBeCalled();
  });

  test('call_refresh', () => {
    const statesHubAPI = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
    statesHubAPI.refresh('some_state_not_exist');

    expect(logger.error).toBeCalled();
  });
});

test('APIStates_getState_should_return_behaviorSubject_with_expected_initial_state', () => {
  const apiStates = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
  const state$ = apiStates.getState$('findPetsByTags');
  expect(state$.getValue()).toEqual(initialState);
});

test('APIStates_getState_should_return_the_same_behaviorSubject', () => {
  const apiStates = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
  const state$1 = apiStates.getState$('findPetsByTags');
  const state$2 = apiStates.getState$('findPetsByTags');

  expect(Object.is(state$1, state$2)).toBe(true);
});

test('APIStates_call_refresh_should_have_no_effect_if_api_has_not_been_called_ever', () => {
  const mockBuild = jest.fn();
  const adapter = { build: mockBuild };
  const apiStates = new StatesHubAPI({ apiSpecAdapter: adapter, apiStateSpec });
  const state$ = apiStates.getState$('findPetsByTags');

  const callback = jest.fn();
  state$.subscribe(callback);

  apiStates.refresh('findPetsByTags');

  expect(callback).toBeCalledTimes(1);
  expect(mockBuild).toBeCalledTimes(0);
});

test('APIStates_fetch_should_call_adapter_build_method', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const adapter = {
    build: jest.fn<AjaxConfig, any>(() => {
      return { method: 'get', url: 'api' };
    }),
  };
  const apiStates = new StatesHubAPI({ apiSpecAdapter: adapter, apiStateSpec });
  const fetchParams = { params: { foo: 'bar' }, body: 'abc' };

  function fetchCallback(): void {
    try {
      expect(adapter.build).toBeCalledTimes(1);
      expect(adapter.build).toBeCalledWith('get:/api', fetchParams);
      done();
    } catch (error) {
      done(error);
    }
  }

  apiStates.fetch('findPetsByTags', {
    callback: fetchCallback,
    params: fetchParams,
  });
});

test('APIStates_fetch_called_should_resolve_values', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const callback = jest.fn();
  const apiStates = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
  const state$ = apiStates.getState$('findPetsByTags');
  const fetchParams = { params: { foo: 'bar' }, body: 'abc' };

  state$.subscribe(callback);

  function fetchCallback(): void {
    try {
      expect(callback).toBeCalledTimes(3);
      done();
    } catch (error) {
      done(error);
    }
  }

  apiStates.fetch('findPetsByTags', {
    callback: fetchCallback,
    params: fetchParams,
  });
});

test('StatesHubAPI_rawFetch', (done) => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => {
    return res.status(200).body(JSON.stringify(mockRes));
  });

  const callback = jest.fn();
  const apiStates = new StatesHubAPI({ apiSpecAdapter, apiStateSpec });
  const state$ = apiStates.getState$('findPetsByTags');

  state$.subscribe(callback);

  function fetchCallback(): void {
    try {
      expect(callback).toBeCalledTimes(3);
      done();
    } catch (error) {
      done(error);
    }
  }

  apiStates.rawFetch('findPetsByTags', {
    callback: fetchCallback,
    method: 'get',
    url: 'some_url'
  });
});

// todo test cases of success and error callbacks
