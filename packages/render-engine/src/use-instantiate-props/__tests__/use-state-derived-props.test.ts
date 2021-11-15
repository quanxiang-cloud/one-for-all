
import mockXHR from 'xhr-mock';
import { renderHook } from '@testing-library/react-hooks/pure';

import petStoreSpec from '../../ctx/spec-interpreter/__tests__/fixtures/petstore-spec';
import useAPIStateDerivedProps from '../use-api-state-derived-props';
import APIStateHub from '../../ctx/api-state-hub';
import SharedStatesHub from '../../ctx/shared-states-hub';
import { APIDerivedProperty, ComponentPropType, CTX, Instantiated } from '../../types';
import NodeInternalStates from '../../ctx/node-internal-states';
import { SchemaNode } from '../..';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap = {
  stream_findPetsByTags: { operationID: 'findPetsByTags' },
  stream_findPetsByTags_1: { operationID: 'findPetsByTags' },
};
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);
const ctx: CTX = {
  apiStates: apiStateHub,
  sharedStates: new SharedStatesHub({}),
  nodeInternalStates: new NodeInternalStates(),
};

test('expect_resolve_initial_value', () => {
  const convertorFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated>> = {
    foo: {
      type: ComponentPropType.APIDerivedProperty,
      fallback: { foo: 123 },
      stateID: 'stream_findPetsByTags',
      adapter: convertorFn,
    },
    bar: {
      type: ComponentPropType.APIDerivedProperty,
      fallback: { bar: 456 },
      stateID: 'stream_findPetsByTags_1',
      adapter: convertorFn,
    },
  };

  const node: SchemaNode<Instantiated> = {
    key: 'some_key',
    props: props,
    type: 'html-element',
    name: 'div',
  };

  const { result, unmount } = renderHook(() => useAPIStateDerivedProps(node, ctx));
  expect(result.current).toMatchObject({ foo: { foo: 123 }, bar: { bar: 456 } });
  expect(result.all.length).toBe(1);
  expect(convertorFn).not.toBeCalled();
  unmount();
});
