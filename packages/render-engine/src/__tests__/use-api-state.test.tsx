import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import mockXHR from 'xhr-mock';

import petStoreSpec from '../spec-interpreter/__tests__/fixtures/petstore-spec';
import type { APIInvokeProperty, APIDerivedProperty, Instantiated, StatesMap } from '../types';
import StateHub from '../state-hub';
import Link from './fixtures/link';

beforeEach(() => mockXHR.setup());
afterEach(() => mockXHR.teardown());

const stateIDMap: StatesMap = { stream_findPetsByTags: { operationID: 'findPetsByTags' } };
const stateHub = new StateHub(petStoreSpec, stateIDMap);

test('Link_changes_the_class_when_hovered', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const onSuccessFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated> | APIInvokeProperty<Instantiated>> = {
    foo: {
      type: 'api_derived_property',
      initialValue: 'foo',
      stateID: 'stream_findPetsByTags',
      template: () => 'abc',
    },
    bar: {
      type: 'api_derived_property',
      initialValue: 'bar',
      stateID: 'stream_findPetsByTags',
      template: () => 'abc',
    },
    onFetch: {
      type: 'api_invoke_property',
      stateID: 'stream_findPetsByTags',
      paramsBuilder: () => undefined,
      onSuccess: onSuccessFn,
    },
  };
  const { container, getByText } = render(<Link nodeProps={props} stateHub={stateHub} />);
  await waitFor(() => expect(onSuccessFn).toBeCalledTimes(1));
  await waitFor(() => getByText('abc:abc'));
  expect(container).toMatchSnapshot();
});

test('search_btn', async () => {
  const mockRes = { data: { id: 'abc-123' } };
  mockXHR.get(/.*/, (req, res) => res.status(200).body(JSON.stringify(mockRes)));

  const onSuccessFn = jest.fn();

  const props: Record<string, APIDerivedProperty<Instantiated> | APIInvokeProperty<Instantiated>> = {
    foo: {
      type: 'api_derived_property',
      initialValue: 'foo',
      stateID: 'stream_findPetsByTags',
      template: () => 'abc',
    },
    bar: {
      type: 'api_derived_property',
      initialValue: 'bar',
      stateID: 'stream_findPetsByTags',
      template: () => 'abc',
    },
    onFetch: {
      type: 'api_invoke_property',
      stateID: 'stream_findPetsByTags',
      paramsBuilder: () => undefined,
      onSuccess: onSuccessFn,
    },
  };
  const { container, getByText } = render(<Link nodeProps={props} stateHub={stateHub} />);
  await waitFor(() => expect(onSuccessFn).toBeCalledTimes(1));
  fireEvent(getByText('abc:abc'), new Event('click'));
  await waitFor(() => getByText('abc:abc'));
  expect(container).toMatchSnapshot();
});

