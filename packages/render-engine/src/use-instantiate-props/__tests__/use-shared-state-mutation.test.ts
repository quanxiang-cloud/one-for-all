import { renderHook, act } from '@testing-library/react-hooks/pure';
import { OpenAPIV3 } from 'openapi-types';
import APIStateHub from '../../ctx/api-state-hub';
import NodeInternalStates from '../../ctx/node-internal-states';
import { ComponentPropType, CTX, Instantiated, SharedStateMutationProperty } from '../../types';

import SharedStatesHub from '../../ctx/shared-states-hub';
import useSharedStateMutationProps from '../use-shared-state-mutation';
import { SchemaNode } from '../..';

const apiDoc: OpenAPIV3.Document = {
  openapi: '3.0.2',
  info: { title: 'some thing', version: '1.0.0' },
  paths: {},
};
const apiStateHub = new APIStateHub(apiDoc, {});

test('test_mutate_shared_state', () => {
  const sharedStates = new SharedStatesHub({
    store_original_value: { initial: undefined },
    store_doubled_value: { initial: 'foo' },
  });
  const ctx: CTX = {
    apiStates: apiStateHub,
    sharedStates: sharedStates,
    nodeInternalStates: new NodeInternalStates(),
  };

  const mutationProps: Record<string, SharedStateMutationProperty<Instantiated>> = {
    onChange: {
      type: ComponentPropType.SharedStateMutationProperty,
      stateID: 'store_original_value',
    },
    onDouble: {
      type: ComponentPropType.SharedStateMutationProperty,
      stateID: 'store_doubled_value',
      adapter: (v) => v * 2,
    },
  };

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    props: mutationProps,
    type: 'html-element',
    name: 'div',
  };

  const { result, unmount } = renderHook(() => useSharedStateMutationProps(node, ctx));

  act(() => {
    result.current.onChange(1);
    result.current.onDouble(1);
  });

  expect(sharedStates.getState$('store_original_value').getValue()).toEqual(1);
  expect(sharedStates.getState$('store_doubled_value').getValue()).toEqual(2);
  unmount();
});
