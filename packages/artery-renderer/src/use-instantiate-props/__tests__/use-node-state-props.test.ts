import { noop } from 'rxjs';
import { act, renderHook } from '@testing-library/react-hooks/pure';
import { logger } from '@one-for-all/utils';

import { ArteryNode } from '../../types';
import StatesHubShared from '../../boot-up/states-hub-shared';
import useSharedStateProps from '../use-shared-state-props';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import React from 'react';
import { CTXContext } from '../../use-ctx';

describe('useNodeStateProps_resolve_expected_value', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeKey = 'node_id';
  const someNodeInternalState = { foo: 'bar' };
  hub.exposeNodeState(nodeKey, someNodeInternalState);

  test('resolve_fallback_value_when_node_state_is_undefined', () => {
    const node: ArteryNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: 'some_node_key_which_does_not_exist',
          fallback: '123',
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });
    expect(result.current.anotherNodeState).toEqual('123');

    unmount();
  });

  test('resolve_untouched_node_state_when_no_adapter', () => {
    const node: ArteryNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });
    expect(result.current.anotherNodeState).toEqual(someNodeInternalState);

    unmount();
  });

  test('resolve_fallback_when_adapter_throw', () => {
    const node: ArteryNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: () => {
            throw new Error('should be handled');
          },
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });
    expect(result.current.anotherNodeState).toEqual(false);
    expect(logger.error).toBeCalled();

    unmount();
  });

  test('resolve_fallback_when_adapter_return_undefined', () => {
    const node: ArteryNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: noop,
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });
    expect(result.current.anotherNodeState).toEqual(false);
    expect(logger.error).not.toBeCalled();

    unmount();
  });

  test('resolve_converted_value', () => {
    const node: ArteryNode = {
      id: 'foo',
      type: 'html-element',
      name: 'div',
      props: {
        anotherNodeState: {
          type: 'node_state_property',
          nodePath: nodeKey,
          fallback: false,
          convertor: () => 'bar',
        },
      },
    };
    const wrapper: React.FC = ({ children }) =>
      React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

    const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });

    expect(result.current.anotherNodeState).toEqual('bar');

    unmount();
  });
});

test('useNodeStateProps_should_resolve_after_changed', () => {
  const hub = new StatesHubShared({});
  dummyCTX.statesHubShared = hub;
  const nodeKey = 'node_id';
  const node: ArteryNode = {
    id: 'foo',
    type: 'html-element',
    name: 'div',
    props: {
      anotherNodeState: {
        type: 'node_state_property',
        nodePath: nodeKey,
        fallback: false,
      },
    },
  };
  const wrapper: React.FC = ({ children }) =>
    React.createElement(CTXContext.Provider, { value: dummyCTX }, children);

  const { result, unmount } = renderHook(() => useSharedStateProps(node), { wrapper });

  expect(result.current.anotherNodeState).toEqual(false);

  act(() => hub.exposeNodeState(nodeKey, 'foo'));
  expect(result.current.anotherNodeState).toEqual('foo');

  act(() => hub.exposeNodeState(nodeKey, 'bar'));
  expect(result.current.anotherNodeState).toEqual('bar');

  act(() => hub.exposeNodeState(nodeKey, undefined));
  expect(result.current.anotherNodeState).toEqual('bar');

  unmount();
});
