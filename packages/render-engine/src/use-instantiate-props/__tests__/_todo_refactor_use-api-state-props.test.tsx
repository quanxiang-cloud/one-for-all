import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import mockXHR from 'xhr-mock';

import { APIInvokeProperty, APIDerivedProperty, Instantiated, APIStatesSpec, CTX, NodePropType } from '../../types';
import APIStateHub from '../../ctx/api-state-hub';
import Link from '../../ctx/__tests__/fixtures/link';
import SharedStatesHub from '../../ctx/shared-states-hub';
import NodeStateHub from '../../ctx/node-state-hub';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap: APIStatesSpec = { stream_findPetsByTags: { apiID: 'findPetsByTags' } };
const apiStateHub = new APIStateHub(petStoreSpec, stateIDMap);
const ctx: CTX = {
  apiStates: apiStateHub,
  sharedStates: new SharedStatesHub({}),
  nodeStates: new NodeStateHub(),
};
apiStateHub.initContext(ctx);

test('Link_changes_the_class_when_hovered', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const onSuccessFn = jest.fn();
  const onErrorFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated> | APIInvokeProperty<Instantiated>> = {
    foo: {
      type: NodePropType.APIDerivedProperty,
      fallback: 'foo',
      stateID: 'stream_findPetsByTags',
      adapter: () => 'abc',
    },
    bar: {
      type: NodePropType.APIDerivedProperty,
      fallback: 'bar',
      stateID: 'stream_findPetsByTags',
      adapter: () => 'abc',
    },
    onFetch: {
      type: NodePropType.APIInvokeProperty,
      stateID: 'stream_findPetsByTags',
      paramsBuilder: () => undefined,
      onSuccess: onSuccessFn,
      onError: onErrorFn,
    },
  };
  const { container, getByText } = render(<Link nodeProps={props} ctx={ctx} />);
  await waitFor(() => expect(onSuccessFn).toBeCalledTimes(1));
  await waitFor(() => expect(onSuccessFn).toBeCalledWith({
    ctx: apiStateHub.ctx,
    data: mockRes,
    error: undefined,
    loading: false,
    params: undefined,
  }));
  await waitFor(() => expect(onErrorFn).toBeCalledTimes(0));
  await waitFor(() => getByText('abc:abc'));
  expect(container).toMatchSnapshot();
});

test('search_btn', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const onSuccessFn = jest.fn();
  const onErrorFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated> | APIInvokeProperty<Instantiated>> = {
    foo: {
      type: NodePropType.APIDerivedProperty,
      fallback: 'foo',
      stateID: 'stream_findPetsByTags',
      adapter: () => 'abc',
    },
    bar: {
      type: NodePropType.APIDerivedProperty,
      fallback: 'bar',
      stateID: 'stream_findPetsByTags',
      adapter: () => 'abc',
    },
    onFetch: {
      type: NodePropType.APIInvokeProperty,
      stateID: 'stream_findPetsByTags',
      paramsBuilder: () => undefined,
      onSuccess: onSuccessFn,
      onError: onErrorFn,
    },
  };
  const { container, getByText } = render(<Link nodeProps={props} ctx={ctx} />);
  await waitFor(() => expect(onSuccessFn).toBeCalledTimes(1));
  await waitFor(() => expect(onSuccessFn).toBeCalledWith({
    ctx: apiStateHub.ctx,
    data: mockRes,
    error: undefined,
    loading: false,
    params: undefined,
  }));
  await waitFor(() => expect(onErrorFn).toBeCalledTimes(0));
  fireEvent(getByText('abc:abc'), new Event('click'));
  await waitFor(() => getByText('abc:abc'));
  expect(container).toMatchSnapshot();
});

