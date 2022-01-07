import React from 'react';
import { renderHook } from '@testing-library/react-hooks/pure';
import { logger } from '@ofa/utils';

import {
  ReactComponentNode,
  Instantiated,
  Repository,
  RefLoader,
  InitProps,
  NodeType,
  Schema,
} from '../../types';
import { useLifecycleHook, useNodeComponent, useRefResult } from '../hooks';

jest.mock('../../repository');

function wait(timeSecond: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, timeSecond * 1000);
  });
}

test('useNodeComponent_should_return_null', async () => {
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'null',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { result, unmount } = renderHook(() => useNodeComponent(node));

  // await waitForNextUpdate();

  expect(result.current).toEqual(null);
  // expect(logger.error).toBeCalled();

  unmount();
});

test('useNodeComponent_should_return_dummy_component', async () => {
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { result, unmount, waitForNextUpdate } = renderHook(() => useNodeComponent(node));

  await waitForNextUpdate();

  expect(result.current).toBeTruthy();
  expect(logger.error).not.toBeCalled();

  unmount();
});

test('useNodeComponent_should_return_component_in_repository', () => {
  const dummyComponent = (): JSX.Element => (<div />);
  const node: Pick<ReactComponentNode<Instantiated>, 'packageName' | 'packageVersion' | 'exportName'> = {
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };
  const repository: Repository = {
    'foo@whatever': {
      Foo: dummyComponent,
    },
  };
  const { result, unmount } = renderHook(() => useNodeComponent(node, repository));

  expect(logger.error).not.toBeCalled();
  expect(result.current).toEqual(dummyComponent);

  unmount();
});

test('useLifecycleHook_should_be_called', () => {
  const didMount = jest.fn();
  const willUnmount = jest.fn();
  const { unmount } = renderHook(() => useLifecycleHook({ didMount, willUnmount }));

  unmount();

  expect(didMount).toBeCalled();
  expect(willUnmount).toBeCalled();
});

const DUMMY_SCHEMA: Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'dummy', type: NodeType.HTMLNode, name: 'div' },
};

describe('useRefResult_should_return_undefined', () => {
  test('if_no_schema_id', () => {
    const schemaID = 'some_id';
    const { result, unmount } = renderHook(() => useRefResult(schemaID));

    expect(result.current?.refCTX).toBeFalsy();
    expect(result.current?.refNode).toBeFalsy();
    expect(result.all.length).toBe(1);
    expect(logger.error).toBeCalled();

    unmount();
  });

  test('if_no_refLoader_provided', () => {
    const schemaID = 'some_id';
    const { result, unmount } = renderHook(() => useRefResult(schemaID));

    expect(result.current?.refCTX).toBeFalsy();
    expect(result.current?.refNode).toBeFalsy();
    expect(result.all.length).toBe(1);
    expect(logger.error).toBeCalled();

    unmount();
  });
});

test('useRefResult_should_catch_promise_reject', async () => {
  const schemaID = 'some_id';
  const err = new Error('some error happens');
  const refLoader: RefLoader = (): Promise<InitProps> => {
    return Promise.reject(err);
  };

  const { result, unmount } = renderHook(() => useRefResult(schemaID, refLoader));

  await wait(1);

  expect(result.current?.refCTX).toBeFalsy();
  expect(result.current?.refNode).toBeFalsy();
  expect(result.all.length).toBe(1);
  expect(logger.error).toBeCalledWith(err);

  unmount();
});

test('useRefResult_should_return_expected_value', async () => {
  const schemaID = 'some_id';
  const refLoader: RefLoader = (): Promise<InitProps> => {
    return Promise.resolve({
      schema: DUMMY_SCHEMA,
      apiSpecAdapter: { build: () => ({ url: '', method: '' }) },
    });
  };

  const { result, unmount, waitForValueToChange } = renderHook(() => useRefResult(schemaID, refLoader));

  await waitForValueToChange(() => result.current);

  expect(result.current?.refCTX).toBeTruthy();
  expect(result.current?.refNode).toBeTruthy();
  expect(result.all.length).toBe(2);
  expect(logger.error).not.toBeCalled();

  unmount();
});
