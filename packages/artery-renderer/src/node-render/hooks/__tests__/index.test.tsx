import React from 'react';
import { logger } from '@one-for-all/utils';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import { APISpecAdapter } from '@one-for-all/api-spec-adapter/lib/src/types';
import type { Artery } from '@one-for-all/artery';

import { RefLoader, HTMLNode, APIStatesSpec } from '../../../types';
import APIStatesHub from '../../../boot-up/states-hub-api';
import SharedStateHub from '../../../boot-up/states-hub-shared';
import SharedStatesHub from '../../../boot-up/states-hub-shared';
import dummyCTX from '../../../boot-up/__tests__/fixtures/dummy-ctx';
import { useLifecycleHook, useRefResult, useShouldRender } from '../index';
import { CTXContext } from '../../../use-ctx';

function wait(timeSecond: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, timeSecond * 1000);
  });
}

test('useLifecycleHook_should_be_called', () => {
  const didMount = jest.fn();
  const willUnmount = jest.fn();
  const { unmount } = renderHook(() => useLifecycleHook({ didMount, willUnmount }));

  unmount();

  expect(didMount).toBeCalled();
  expect(willUnmount).toBeCalled();
});

const DUMMY_SCHEMA: Artery = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'dummy', type: 'html-element', name: 'div' },
};

describe('useRefResult_should_return_undefined', () => {
  test('if_no_schema_id', () => {
    const arteryID = 'some_id';
    const { result, unmount } = renderHook(() => useRefResult({ arteryID: arteryID }, dummyCTX));

    expect(result.current?.ctx).toBeFalsy();
    expect(result.current?.rootNode).toBeFalsy();
    expect(result.all.length).toBe(1);
    expect(logger.error).toBeCalled();

    unmount();
  });

  test('if_no_refLoader_provided', () => {
    const arteryID = 'some_id';
    const { result, unmount } = renderHook(() => useRefResult({ arteryID: arteryID }, dummyCTX));

    expect(result.current?.ctx).toBeFalsy();
    expect(result.current?.rootNode).toBeFalsy();
    expect(result.all.length).toBe(1);
    expect(logger.error).toBeCalled();

    unmount();
  });
});

test('useRefResult_should_catch_promise_reject', async () => {
  const arteryID = 'some_id';
  const err = new Error('some error happens');
  const refLoader: RefLoader = (): Promise<any> => {
    return Promise.reject(err);
  };

  const { result, unmount } = renderHook(() => useRefResult({ arteryID: arteryID, refLoader }, dummyCTX));

  await wait(1);

  expect(result.current?.ctx).toBeFalsy();
  expect(result.current?.rootNode).toBeFalsy();
  expect(result.all.length).toBe(1);
  expect(logger.error).toBeCalledWith(err);

  unmount();
});

test('useRefResult_should_return_expected_value', async () => {
  const arteryID = 'some_id';
  const refLoader: RefLoader = () => {
    return Promise.resolve({
      artery: DUMMY_SCHEMA,
      plugins: {
        apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
      },
    });
  };

  const { result, unmount, waitForValueToChange } = renderHook(() =>
    useRefResult({ arteryID: arteryID, refLoader }, dummyCTX),
  );

  await waitForValueToChange(() => result.current);

  expect(result.current?.ctx).toBeTruthy();
  expect(result.current?.rootNode).toBeTruthy();
  expect(result.all.length).toBe(2);
  expect(logger.error).not.toBeCalled();

  unmount();
});

const apiSpecAdapter: APISpecAdapter = {
  build: () => ({ url: '/api', method: 'get' }),
};
const apiStateSpec: APIStatesSpec = {
  some_api_state: { apiID: 'get:/api' },
};
const apiStateHub = new APIStatesHub({ apiSpecAdapter, apiStateSpec });

test('useShouldRender_should_return_expected_value_according_api_loading', async () => {
  dummyCTX.statesHubAPI = apiStateHub;
  const node1: HTMLNode = {
    id: 'condition-render-node',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'api_loading_property',
      stateID: 'some_api_state',
    },
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };
  const node2: HTMLNode = {
    id: 'condition-render-node',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'api_loading_property',
      stateID: 'some_api_state',
      revert: true,
    },
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

  const { result: res1, unmount: unmount1 } = renderHook(() => useShouldRender(node1), { wrapper });
  const { result: res2, unmount: unmount2 } = renderHook(() => useShouldRender(node2), { wrapper });

  expect(res1.current).toBe(false);
  expect(res2.current).toBe(true);

  unmount1();
  unmount2();
});

test('useShouldRender_should_return_expected_value_according_api_result', async () => {
  dummyCTX.statesHubAPI = apiStateHub;
  const node: HTMLNode = {
    id: 'condition-render-node',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'api_result_property',
      stateID: 'some_api_state',
      fallback: false,
      convertor: (v): boolean => {
        return (v as Array<any>).length > 4;
      },
    },
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };

  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useShouldRender(node), { wrapper });

  // fallback
  expect(result.current).toBe(false);

  // convertor
  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: [0, 1, 2, 3, 4],
      error: undefined,
      loading: true,
    });
  });
  expect(result.current).toBe(true);

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: [0, 1, 2],
      error: undefined,
      loading: true,
    });
  });
  expect(result.current).toBe(false);

  unmount();
});

test('useShouldRender_should_return_expected_value_according_shared_state', () => {
  const sharedStates = new SharedStatesHub({
    visible: { initial: false },
  });
  dummyCTX.statesHubShared = sharedStates;

  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'shared_state_property',
      stateID: 'visible',
      fallback: true,
      convertor: (v: any): boolean => {
        return !v.condition1 || !v.condition2;
      },
    },
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };

  expect(sharedStates.getState$('visible').value).toBe(false);
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useShouldRender(node), { wrapper });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next({ condition1: true, condition2: true });
  });
  expect(result.current).toBe(false);

  unmount();
});

test('useShouldRender_should_return_expected_value_according_node_state', () => {
  const hub = new SharedStateHub({});
  dummyCTX.statesHubShared = hub;
  const nodeKey = 'node_id';
  const nodePath = `ROOT/${nodeKey}`;
  const someNodeInternalState = { condition1: true, condition2: false };
  hub.exposeNodeState(nodePath, someNodeInternalState);

  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'node_state_property',
      nodePath: nodePath,
      fallback: true,
      convertor: (v: any): boolean => {
        return !!v.condition1 && !!v.condition2;
      },
    },
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };

  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useShouldRender(node), { wrapper });
  expect(result.current).toBe(false);

  act(() => {
    hub.getNodeState$(nodePath).next({ condition1: true, condition2: true });
  });
  expect(result.current).toBe(true);

  unmount();
});

test('useShouldRender_should_return_expected_value_according_computed_state', () => {
  const sharedStates = new SharedStatesHub({
    visible: { initial: false },
  });
  dummyCTX.statesHubAPI = apiStateHub;
  dummyCTX.statesHubShared = sharedStates;
  const nodeKey = 'node_id';
  const nodePath = `ROOT/${nodeKey}`;
  const someNodeInternalState = false;
  sharedStates.exposeNodeState(nodePath, someNodeInternalState);

  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'computed_property',
      deps: [
        {
          type: 'api_state',
          depID: 'some_api_state',
        },
        {
          type: 'node_state',
          depID: nodePath,
        },
        {
          type: 'shared_state',
          depID: 'visible',
        },
      ],
      fallback: false,
      convertor: (states) => {
        const _states = states as Record<string, any>;
        const sharedState = _states.visible;
        const nodeState = _states[`${nodePath}`];
        const loading = _states.some_api_state.loading;

        return sharedState || nodeState || loading;
      },
    },
  };

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: undefined,
      error: undefined,
      loading: true,
    });
  });

  expect(apiStateHub.getState$('some_api_state').value.result).toBeUndefined();
  expect(sharedStates.getState$('visible').value).toBe(false);
  expect(sharedStates.getNodeState$(nodePath).value).toBe(false);
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useShouldRender(node), { wrapper });
  expect(result.current).toBe(true);

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: { dep1: false, dep2: true },
      error: undefined,
      loading: false,
    });
  });
  expect(result.current).toBe(false);

  act(() => {
    sharedStates.getState$('visible').next(true);
    sharedStates.getNodeState$(nodePath).next(false);
  });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next(false);
    sharedStates.getNodeState$(nodePath).next(true);
  });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next(false);
    sharedStates.getNodeState$(nodePath).next(false);
  });
  expect(result.current).toBe(false);

  unmount();
});

test('useShouldRender_should_return_Init_value_according_computed_state', () => {
  const sharedStates = new SharedStatesHub({
    visible: { initial: false },
  });
  dummyCTX.statesHubAPI = apiStateHub;
  dummyCTX.statesHubShared = sharedStates;
  const nodeKey = 'node_id';
  const nodePath = `ROOT/${nodeKey}`;
  const someNodeInternalState = false;
  sharedStates.exposeNodeState(nodePath, someNodeInternalState);

  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: 'div',
    shouldRender: {
      type: 'computed_property',
      deps: [],
      fallback: false,
      convertor: (states) => {
        const loading = dummyCTX.statesHubAPI.getState$('some_api_state').value.loading;
        const sharedState = dummyCTX.statesHubShared.getState$('visible').value;
        const nodeState = dummyCTX.statesHubShared.getNodeState$(nodePath).value;

        return sharedState || nodeState || loading;
      },
    },
  };

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: undefined,
      error: undefined,
      loading: true,
    });
  });

  expect(apiStateHub.getState$('some_api_state').value.result).toBeUndefined();
  expect(sharedStates.getState$('visible').value).toBe(false);
  expect(sharedStates.getNodeState$(nodePath).value).toBe(false);
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);
  const { result, unmount } = renderHook(() => useShouldRender(node), { wrapper });
  expect(result.current).toBe(true);

  act(() => {
    apiStateHub.getState$('some_api_state').next({
      result: { dep1: false, dep2: true },
      error: undefined,
      loading: false,
    });
  });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next(true);
    sharedStates.getNodeState$(nodePath).next(false);
  });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next(false);
    sharedStates.getNodeState$(nodePath).next(true);
  });
  expect(result.current).toBe(true);

  act(() => {
    sharedStates.getState$('visible').next(false);
    sharedStates.getNodeState$(nodePath).next(false);
  });
  expect(result.current).toBe(true);

  unmount();
});
